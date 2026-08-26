<?php

namespace Modules\Reports\Repositories;

use Core\Database;
use PDO;

class ReportRepository
{
    public function getAttendanceReports(array $filters = []): array
    {
        $sql = "
            SELECT
                a.id,
                a.employee_id,
                e.full_name AS employee_name,
                a.attendance_date,
                a.check_in,
                a.check_out,
                a.working_hours,
                a.status,
                d.department_name
            FROM attendance a
            LEFT JOIN employees e
                ON e.employee_id = a.employee_id
            LEFT JOIN departments d
                ON d.department_id = e.department_id
            WHERE 1 = 1
        ";

        $params = [];

        if (!empty($filters['date_from'])) {
            $sql .= " AND a.attendance_date >= :date_from";
            $params['date_from'] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $sql .= " AND a.attendance_date <= :date_to";
            $params['date_to'] = $filters['date_to'];
        }

        if (!empty($filters['employee_id'])) {
            $sql .= " AND a.employee_id = :employee_id";
            $params['employee_id'] = $filters['employee_id'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND a.status = :attendance_status";
            $params['attendance_status'] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= "
                AND (
                    a.employee_id LIKE :attendance_search
                    OR e.full_name LIKE :employee_search
                )
            ";

            $search = '%' . $filters['search'] . '%';
            $params['attendance_search'] = $search;
            $params['employee_search'] = $search;
        }

        $sql .= " ORDER BY a.attendance_date DESC, employee_name ASC";

        $statement = Database::connection()->prepare($sql);
        $statement->execute($params);

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getSalesReports(array $filters = []): array
    {
        $sql = "
            SELECT
                o.order_id,
                o.order_date,
                o.employee_id,
                e.full_name AS employee_name,
                o.territory_id,
                t.territory_name,
                o.order_status,
                o.order_value
            FROM orders o
            LEFT JOIN employees e
                ON e.employee_id = o.employee_id
            LEFT JOIN territories t
                ON t.territory_id = o.territory_id
            WHERE 1 = 1
        ";

        $params = [];

        if (!empty($filters['date_from'])) {
            $sql .= " AND o.order_date >= :date_from";
            $params['date_from'] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $sql .= " AND o.order_date <= :date_to";
            $params['date_to'] = $filters['date_to'];
        }

        if (!empty($filters['employee_id'])) {
            $sql .= " AND o.employee_id = :employee_id";
            $params['employee_id'] = $filters['employee_id'];
        }

        if (!empty($filters['territory_id'])) {
            $sql .= " AND o.territory_id = :territory_id";
            $params['territory_id'] = $filters['territory_id'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND o.order_status = :order_status";
            $params['order_status'] = $filters['status'];
        }

        $sql .= " ORDER BY o.order_date DESC";

        $statement = Database::connection()->prepare($sql);
        $statement->execute($params);

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEmployeeReports(array $filters = []): array
    {
        $sql = "
            SELECT
                e.employee_id,
                e.employee_code,
                e.full_name AS employee_name,
                e.email,
                e.phone,
                e.department_id,
                d.department_name,
                e.designation_id,
                ds.designation_name,
                e.employee_status_id
            FROM employees e
            LEFT JOIN departments d
                ON d.department_id = e.department_id
            LEFT JOIN designations ds
                ON ds.designation_id = e.designation_id
            WHERE 1 = 1
        ";

        $params = [];

        if (!empty($filters['department_id'])) {
            $sql .= " AND e.department_id = :department_id";
            $params['department_id'] = $filters['department_id'];
        }

        if (!empty($filters['search'])) {
            $sql .= "
                AND (
                    e.employee_id LIKE :employee_id_search
                    OR e.employee_code LIKE :employee_code_search
                    OR e.full_name LIKE :employee_name_search
                    OR e.email LIKE :email_search
                )
            ";

            $search = '%' . $filters['search'] . '%';

            $params['employee_id_search'] = $search;
            $params['employee_code_search'] = $search;
            $params['employee_name_search'] = $search;
            $params['email_search'] = $search;
        }

        $sql .= " ORDER BY employee_name ASC";

        $statement = Database::connection()->prepare($sql);
        $statement->execute($params);

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAsmReports(array $filters = []): array
{
    $sql = "
        SELECT
            asm.employee_id AS id,
            asm.full_name AS asmName,
            COALESCE(t.territory_name, 'Unassigned') AS region,

            (
                SELECT COUNT(*)
                FROM employees se
                INNER JOIN designations se_ds
                    ON se_ds.designation_id = se.designation_id
                WHERE se_ds.designation_name = 'Sales Executive'
                  AND se.reporting_manager_id = asm.employee_id
            ) AS teamSize,

            COALESCE(SUM(tg.target_value), 0) AS target,
            COALESCE(SUM(tg.achieved_value), 0) AS achievement,

            CASE
                WHEN COALESCE(SUM(tg.target_value), 0) = 0 THEN 0
                ELSE ROUND(
                    (
                        COALESCE(SUM(tg.achieved_value), 0)
                        / SUM(tg.target_value)
                    ) * 100,
                    2
                )
            END AS percentage,

            CASE
                WHEN (
                    SELECT COUNT(*)
                    FROM employees se
                    INNER JOIN designations se_ds
                        ON se_ds.designation_id = se.designation_id
                    WHERE se_ds.designation_name = 'Sales Executive'
                      AND se.reporting_manager_id = asm.employee_id
                ) = 0 THEN 0
                ELSE (
                    SELECT ROUND(
                        AVG(
                            CASE
                                WHEN COALESCE(se_target.target_value, 0) = 0 THEN 0
                                ELSE (
                                    COALESCE(se_target.achieved_value, 0)
                                    / se_target.target_value
                                ) * 100
                            END
                        ),
                        2
                    )
                    FROM employees se
                    INNER JOIN designations se_ds
                        ON se_ds.designation_id = se.designation_id
                    LEFT JOIN targets se_target
                        ON se_target.assigned_to_employee_id = se.employee_id
                    WHERE se_ds.designation_name = 'Sales Executive'
                      AND se.reporting_manager_id = asm.employee_id
                )
            END AS teamPerformance

        FROM employees asm

        INNER JOIN designations asm_ds
            ON asm_ds.designation_id = asm.designation_id

        LEFT JOIN targets tg
            ON tg.assigned_to_employee_id = asm.employee_id

        LEFT JOIN territories t
            ON t.territory_id = tg.territory_id

        WHERE asm_ds.designation_name = 'Area Sales Manager'
    ";

    $params = [];

    if (!empty($filters['employee_id'])) {
        $sql .= " AND asm.employee_id = :asm_employee_id";
        $params['asm_employee_id'] = $filters['employee_id'];
    }

    if (!empty($filters['territory_id'])) {
        $sql .= " AND tg.territory_id = :asm_territory_id";
        $params['asm_territory_id'] = $filters['territory_id'];
    }

    if (!empty($filters['date_from'])) {
        $sql .= " AND tg.period_end >= :asm_date_from";
        $params['asm_date_from'] = $filters['date_from'];
    }

    if (!empty($filters['date_to'])) {
        $sql .= " AND tg.period_start <= :asm_date_to";
        $params['asm_date_to'] = $filters['date_to'];
    }

    $sql .= "
        GROUP BY
            asm.employee_id,
            asm.full_name,
            t.territory_name
        ORDER BY percentage DESC, asm.full_name ASC
    ";

    $statement = Database::connection()->prepare($sql);
    $statement->execute($params);

    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $index => &$row) {
        $row['target'] = (float) $row['target'];
        $row['achievement'] = (float) $row['achievement'];
        $row['percentage'] = (float) $row['percentage'];
        $row['teamSize'] = (int) $row['teamSize'];
        $row['teamPerformance'] = (float) $row['teamPerformance'];
        $row['rank'] = $index + 1;
    }

    return $rows;
}

    public function getCompanyMetrics(array $filters = []): array
    {
        $attendanceWhere = '';
        $salesWhere = '';
        $params = [];

        if (!empty($filters['date_from'])) {
            $attendanceWhere .= " AND attendance_date >= :metric_date_from";
            $salesWhere .= " AND order_date >= :metric_date_from";
            $params['metric_date_from'] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $attendanceWhere .= " AND attendance_date <= :metric_date_to";
            $salesWhere .= " AND order_date <= :metric_date_to";
            $params['metric_date_to'] = $filters['date_to'];
        }

        $sql = "
            SELECT
                (SELECT COUNT(*) FROM employees) AS total_employees,

                (
                    SELECT COUNT(*)
                    FROM attendance
                    WHERE status = 'Present'
                    $attendanceWhere
                ) AS present_records,

                (
                    SELECT COUNT(*)
                    FROM attendance
                    WHERE status = 'Absent'
                    $attendanceWhere
                ) AS absent_records,

                (
                    SELECT COALESCE(SUM(order_value), 0)
                    FROM orders
                    WHERE 1 = 1
                    $salesWhere
                ) AS total_sales
        ";

        $statement = Database::connection()->prepare($sql);
        $statement->execute($params);

        return $statement->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    public function getChartData(array $filters = []): array
{
    $params = [];

    $attendanceWhere = '';
    $salesWhere = '';
    $targetWhere = '';

    if (!empty($filters['date_from'])) {
        $attendanceWhere .= " AND a.attendance_date >= :chart_date_from";
        $salesWhere .= " AND o.order_date >= :chart_date_from";
        $targetWhere .= " AND tg.period_end >= :chart_date_from";

        $params['chart_date_from'] = $filters['date_from'];
    }

    if (!empty($filters['date_to'])) {
        $attendanceWhere .= " AND a.attendance_date <= :chart_date_to";
        $salesWhere .= " AND o.order_date <= :chart_date_to";
        $targetWhere .= " AND tg.period_start <= :chart_date_to";

        $params['chart_date_to'] = $filters['date_to'];
    }

    /*
     * Monthly attendance trend
     */
    $attendanceSql = "
        SELECT
            DATE_FORMAT(a.attendance_date, '%b') AS day,
            SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present,
            SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS late,
            SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent
        FROM attendance a
        WHERE 1 = 1
        $attendanceWhere
        GROUP BY YEAR(a.attendance_date), MONTH(a.attendance_date)
        ORDER BY YEAR(a.attendance_date), MONTH(a.attendance_date)
    ";

    $statement = Database::connection()->prepare($attendanceSql);
    $statement->execute($params);

    $monthlyAttendanceTrend = $statement->fetchAll(PDO::FETCH_ASSOC);

    /*
     * Monthly sales trend
     */
    $salesSql = "
        SELECT
            DATE_FORMAT(o.order_date, '%b') AS name,
            COALESCE(SUM(tg.target_value), 0) AS target,
            COALESCE(SUM(o.order_value), 0) AS actual
        FROM orders o
        LEFT JOIN targets tg
            ON tg.assigned_to_employee_id = o.employee_id
            AND o.order_date BETWEEN tg.period_start AND tg.period_end
        WHERE 1 = 1
        $salesWhere
        GROUP BY YEAR(o.order_date), MONTH(o.order_date)
        ORDER BY YEAR(o.order_date), MONTH(o.order_date)
    ";

    $statement = Database::connection()->prepare($salesSql);
    $statement->execute($params);

    $monthlySalesTrend = $statement->fetchAll(PDO::FETCH_ASSOC);

    /*
     * Department performance based on attendance.
     */
    $departmentSql = "
        SELECT
            d.department_name AS name,
            ROUND(
                AVG(
                    CASE
                        WHEN a.status = 'Present' THEN 100
                        WHEN a.status = 'Late' THEN 75
                        WHEN a.status = 'WFH' THEN 100
                        ELSE 0
                    END
                ),
                2
            ) AS value
        FROM departments d
        INNER JOIN employees e
            ON e.department_id = d.department_id
        INNER JOIN attendance a
            ON a.employee_id = e.employee_id
        WHERE 1 = 1
        $attendanceWhere
        GROUP BY d.department_id, d.department_name
        ORDER BY d.department_name ASC
    ";

    $statement = Database::connection()->prepare($departmentSql);
    $statement->execute($params);

    $departmentPerformance = $statement->fetchAll(PDO::FETCH_ASSOC);

    /*
     * Region achievement from targets.
     */
    $regionSql = "
        SELECT
            t.territory_name AS name,
            CASE
                WHEN COALESCE(SUM(tg.target_value), 0) = 0 THEN 0
                ELSE ROUND(
                    (
                        SUM(tg.achieved_value)
                        / SUM(tg.target_value)
                    ) * 100,
                    2
                )
            END AS value
        FROM territories t
        INNER JOIN targets tg
            ON tg.territory_id = t.territory_id
        WHERE 1 = 1
        $targetWhere
        GROUP BY t.territory_id, t.territory_name
        ORDER BY t.territory_name ASC
    ";

    $statement = Database::connection()->prepare($regionSql);
    $statement->execute($params);

    $regionAchievement = $statement->fetchAll(PDO::FETCH_ASSOC);

    /*
     * Region team distribution.
     */
    $teamDistributionSql = "
        SELECT
            t.territory_name AS name,
            COUNT(DISTINCT ta.assigned_to_employee_id) AS value
        FROM territories t
        INNER JOIN territory_assignments ta
            ON ta.territory_id = t.territory_id
        WHERE ta.status = 'Active'
        GROUP BY t.territory_id, t.territory_name
        ORDER BY t.territory_name ASC
    ";

    $statement = Database::connection()->prepare($teamDistributionSql);
    $statement->execute();

    $regionTeamDistribution = $statement->fetchAll(PDO::FETCH_ASSOC);

    return [
        'monthlyAttendanceTrend' => $monthlyAttendanceTrend,
        'salesCategoryBreakdown' => [],
        'departmentPerformance' => $departmentPerformance,
        'monthlySalesTrend' => $monthlySalesTrend,
        'regionAchievement' => $regionAchievement,
        'companyPerformanceTrend' => $monthlyAttendanceTrend,
        'regionTeamDistribution' => $regionTeamDistribution,
    ];
}

}


