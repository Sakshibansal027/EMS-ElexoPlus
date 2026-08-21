<?php

namespace Modules\Dashboard\Services;

use Modules\Dashboard\Repositories\DashboardRepository;
use Modules\Dashboard\Support\DateRange;

class DashboardService
{
    private const ROLES = ['ADMIN', 'HR', 'ASM', 'SALES_EXECUTIVE'];

    public function __construct(private ?DashboardRepository $repository = null)
    {
        $this->repository ??= new DashboardRepository();
    }

    public function getDashboard(array $user): array
    {
        $role = $this->repository->resolveRole($user);
        $role = in_array($role, self::ROLES, true) ? $role : 'SALES_EXECUTIVE';
        $employeeId = (string) ($user['employee_id'] ?? '');
        $range = DateRange::currentMonth();

        return ['success' => true, 'data' => [
            'role' => $role,
            'generated_at' => date(DATE_ATOM),
            'period' => ['from' => $range->from, 'to' => $range->to],
            'kpis' => $this->kpis($role, $employeeId, $range),
            'analytics' => $this->analytics($role, $employeeId, $range),
            'tasks' => $this->tasks($role, $employeeId),
            'activities' => $this->activities($role, $employeeId),
        ]];
    }

    private function kpis(string $role, string $employeeId, DateRange $range): array
    {
        $activeEmployees = fn() => $this->repository->scalar("SELECT COUNT(*) FROM employees e INNER JOIN employee_statuses s ON s.employee_status_id=e.employee_status_id WHERE s.status_name='Active'");
        if ($role === 'ADMIN') return [
            $this->metric('Total Employees', $activeEmployees()),
            $this->metric('Monthly Payroll', $this->repository->scalar('SELECT COALESCE(SUM(net_salary),0) FROM payrolls p INNER JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id WHERE pp.period_start>=? AND pp.period_end<=?', [$range->from, $range->to]), 'currency'),
            $this->metric('Sales Revenue', $this->salesValue($range), 'currency'),
            $this->metric('Pending Approvals', $this->repository->scalar("SELECT COUNT(*) FROM leave_approvals WHERE decision='Pending'")),
        ];
        if ($role === 'HR') return [
            $this->metric('Active Employees', $activeEmployees()),
            $this->metric('New Joinees', $this->repository->scalar('SELECT COUNT(*) FROM employees WHERE date_of_joining BETWEEN ? AND ?', [$range->from, $range->to])),
            $this->metric('Pending Leave Requests', $this->repository->scalar("SELECT COUNT(*) FROM leave_approvals WHERE decision='Pending' AND approval_level='HR'")),
            $this->metric('Pending Documents', $this->repository->scalar("SELECT COUNT(*) FROM employee_documents WHERE status='Pending'")),
        ];

        $team = $role === 'ASM' ? $this->repository->directReportIds($employeeId) : [$employeeId];
        [$marks, $params] = $this->inClause(array_filter($team));
        if ($marks === '') $marks = "''";
        $target = $this->repository->row("SELECT COALESCE(SUM(target_value),0) target, COALESCE(SUM(achieved_value),0) achieved FROM targets WHERE assigned_to_employee_id IN ($marks) AND period_start<=? AND period_end>=?", [...$params, $range->to, $range->from]) ?? [];
        $achievement = (float) ($target['target'] ?? 0) > 0 ? round((float) $target['achieved'] / (float) $target['target'] * 100, 2) : 0;
        if ($role === 'ASM') return [
            $this->metric('Team Members', count($team)), $this->metric('Target Achievement', $achievement, 'percentage'),
            $this->metric('Regional Sales', $this->repository->scalar("SELECT COALESCE(SUM(order_value),0) FROM orders WHERE employee_id IN ($marks) AND order_date BETWEEN ? AND ? AND order_status<>'Cancelled'", [...$params, $range->from, $range->to]), 'currency'),
            $this->metric('Field Visits Today', $this->repository->scalar("SELECT COUNT(*) FROM client_visits WHERE employee_id IN ($marks) AND visit_date=CURDATE()", $params)),
        ];
        return [
            $this->metric("Today's Visits", $this->repository->scalar('SELECT COUNT(*) FROM client_visits WHERE employee_id=? AND visit_date=CURDATE()', [$employeeId])),
            $this->metric('Orders Booked', $this->repository->scalar("SELECT COUNT(*) FROM orders WHERE employee_id=? AND order_date=CURDATE() AND order_status<>'Cancelled'", [$employeeId])),
            $this->metric('Target Achievement', $achievement, 'percentage'),
            $this->metric('Projected Incentive', $this->repository->scalar('SELECT COALESCE(SUM(total_incentives),0) FROM payrolls p INNER JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id WHERE p.employee_id=? AND pp.period_start>=? AND pp.period_end<=?', [$employeeId, $range->from, $range->to]), 'currency'),
        ];
    }

    private function analytics(string $role, string $employeeId, DateRange $range): array
    {
        if ($role === 'ADMIN') return ['revenue_trend' => $this->monthlySeries('orders', 'order_date', 'order_value'), 'target_achievement' => $this->targetProgress(), 'department_distribution' => $this->repository->rows('SELECT d.department_name name, COUNT(*) value FROM employees e INNER JOIN departments d ON d.department_id=e.department_id GROUP BY d.department_id,d.department_name ORDER BY value DESC LIMIT 8')];
        if ($role === 'HR') return ['attendance_trend' => $this->attendanceSeries(), 'attendance_score' => $this->attendanceScore($range), 'hiring_performance' => $this->monthlySeries('employees', 'date_of_joining')];
        if ($role === 'ASM') return ['sales_trend' => $this->teamSalesSeries($employeeId), 'target_achievement' => $this->targetProgress($employeeId, true), 'top_executives' => $this->topExecutives($employeeId, $range)];
        return ['daily_orders' => $this->dailyOrders($employeeId), 'target_achievement' => $this->targetProgress($employeeId), 'visit_performance' => $this->repository->rows("SELECT DATE_FORMAT(visit_date, '%a') name, COUNT(*) value FROM client_visits WHERE employee_id=? AND visit_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE() GROUP BY visit_date ORDER BY visit_date", [$employeeId])];
    }

    private function tasks(string $role, string $employeeId): array
    {
        $tasks = [];
        if (in_array($role, ['ADMIN', 'HR', 'ASM'], true)) $this->appendTask($tasks, 'Leave approvals', $this->repository->scalar("SELECT COUNT(*) FROM leave_approvals WHERE approver_employee_id=? AND decision='Pending'", [$employeeId]), 'request(s) awaiting your approval', 'high', '/leave');
        if ($role === 'HR') $this->appendTask($tasks, 'Document verification', $this->repository->scalar("SELECT COUNT(*) FROM employee_documents WHERE status='Pending'"), 'document(s) pending review', 'medium', '/employees');
        if ($role === 'ASM') $this->appendTask($tasks, 'Daily activity reports', $this->repository->scalar("SELECT COUNT(*) FROM daily_activity_reports WHERE reviewed_by_employee_id=? AND review_status='Pending'", [$employeeId]), 'report(s) awaiting review', 'medium', '/sales');
        if ($role === 'SALES_EXECUTIVE') {
            if (!$this->repository->scalar('SELECT COUNT(*) FROM daily_activity_reports WHERE employee_id=? AND report_date=CURDATE()', [$employeeId])) $tasks[] = $this->task('Submit DAR', "Today's report has not been submitted", 'high', '/sales');
            $this->appendTask($tasks, 'Lead follow-up', $this->repository->scalar("SELECT COUNT(*) FROM leads WHERE assigned_employee_id=? AND current_status<>'Closed'", [$employeeId]), 'active lead(s) need follow-up', 'medium', '/sales');
        }
        return array_slice($tasks, 0, 6);
    }

    private function activities(string $role, string $employeeId): array
    {
        $items = [];
        foreach ($this->repository->rows('SELECT order_no,order_value,created_at FROM orders WHERE employee_id=? ORDER BY created_at DESC LIMIT 4', [$employeeId]) as $row) $items[] = $this->activity('Order created', "Order {$row['order_no']} for ₹" . number_format((float) $row['order_value'], 2), 'success', $row['created_at']);
        foreach ($this->repository->rows('SELECT lead_name,created_at FROM leads WHERE assigned_employee_id=? ORDER BY created_at DESC LIMIT 3', [$employeeId]) as $row) $items[] = $this->activity('Lead added', $row['lead_name'], 'info', $row['created_at']);
        if (in_array($role, ['ADMIN', 'HR', 'ASM'], true)) foreach ($this->repository->rows('SELECT lr.status,lr.updated_at,e.full_name FROM leave_requests lr INNER JOIN employees e ON e.employee_id=lr.employee_id ORDER BY lr.updated_at DESC LIMIT 5') as $row) $items[] = $this->activity('Leave ' . strtolower($row['status']), $row['full_name'] . "'s leave request", $row['status'] === 'Approved' ? 'success' : 'warning', $row['updated_at']);
        usort($items, fn(array $a, array $b) => strcmp($b['occurred_at'], $a['occurred_at']));
        return array_slice($items, 0, 6);
    }

    private function salesValue(DateRange $range): int|float { return $this->repository->scalar("SELECT COALESCE(SUM(order_value),0) FROM orders WHERE order_date BETWEEN ? AND ? AND order_status<>'Cancelled'", [$range->from, $range->to]); }
    private function monthlySeries(string $table, string $date, ?string $value = null): array { $out=[]; foreach(DateRange::currentMonth()->months() as $month) $out[]=['name'=>$month['label'],'value'=>$this->repository->scalar($value ? "SELECT COALESCE(SUM($value),0) FROM $table WHERE $date BETWEEN ? AND ?" : "SELECT COUNT(*) FROM $table WHERE $date BETWEEN ? AND ?", [$month['from'],$month['to']])]; return $out; }
    private function attendanceSeries(): array { $out=[]; foreach(DateRange::currentMonth()->months() as $m){$total=$this->repository->scalar('SELECT COUNT(*) FROM attendance_records WHERE attendance_date BETWEEN ? AND ?',[$m['from'],$m['to']]);$present=$this->repository->scalar("SELECT COUNT(*) FROM attendance_records WHERE attendance_date BETWEEN ? AND ? AND status IN ('Present','Late','Work From Home','Half Day')",[$m['from'],$m['to']]);$out[]=['name'=>$m['label'],'value'=>$total?round($present/$total*100,2):0];}return $out; }
    private function attendanceScore(DateRange $range): array { $total=$this->repository->scalar('SELECT COUNT(*) FROM attendance_records WHERE attendance_date BETWEEN ? AND ?',[$range->from,$range->to]);$present=$this->repository->scalar("SELECT COUNT(*) FROM attendance_records WHERE attendance_date BETWEEN ? AND ? AND status IN ('Present','Late','Work From Home','Half Day')",[$range->from,$range->to]);return [['name'=>'Attendance','value'=>$total?round($present/$total*100,2):0]]; }
    private function targetProgress(?string $employeeId=null, bool $team=false): array { $sql='SELECT COALESCE(SUM(target_value),0) target,COALESCE(SUM(achieved_value),0) achieved FROM targets WHERE period_start<=CURDATE() AND period_end>=CURDATE()';$params=[];if($employeeId&&!$team){$sql.=' AND assigned_to_employee_id=?';$params[]=$employeeId;}if($employeeId&&$team){[$marks,$params]=$this->inClause($this->repository->directReportIds($employeeId));if(!$marks)return [['name'=>'Target','value'=>0]];$sql.=" AND assigned_to_employee_id IN ($marks)";}$row=$this->repository->row($sql,$params)??[];return [['name'=>'Target','value'=>(float)($row['target']??0)>0?round($row['achieved']/$row['target']*100,2):0]]; }
    private function teamSalesSeries(string $employeeId): array { [$marks,$params]=$this->inClause($this->repository->directReportIds($employeeId));if(!$marks)return []; $out=[];foreach(DateRange::currentMonth()->months() as $m)$out[]=['name'=>$m['label'],'value'=>$this->repository->scalar("SELECT COALESCE(SUM(order_value),0) FROM orders WHERE employee_id IN ($marks) AND order_date BETWEEN ? AND ? AND order_status<>'Cancelled'",[...$params,$m['from'],$m['to']])];return $out; }
    private function topExecutives(string $employeeId, DateRange $range): array { [$marks,$params]=$this->inClause($this->repository->directReportIds($employeeId));if(!$marks)return [];return $this->repository->rows("SELECT e.full_name name,COALESCE(SUM(o.order_value),0) value FROM employees e LEFT JOIN orders o ON o.employee_id=e.employee_id AND o.order_date BETWEEN ? AND ? AND o.order_status<>'Cancelled' WHERE e.employee_id IN ($marks) GROUP BY e.employee_id,e.full_name ORDER BY value DESC LIMIT 8",[$range->from,$range->to,...$params]); }
    private function dailyOrders(string $employeeId): array { $out=[];for($i=6;$i>=0;$i--){$day=date('Y-m-d',strtotime("-$i days"));$out[]=['name'=>date('D',strtotime($day)),'value'=>$this->repository->scalar("SELECT COUNT(*) FROM orders WHERE employee_id=? AND order_date=? AND order_status<>'Cancelled'",[$employeeId,$day])];}return $out; }
    private function metric(string $title, int|float $value, string $format='count'): array { return ['title'=>$title,'value'=>$value+0,'format'=>$format]; }
    private function appendTask(array &$tasks,string $title,int|float $count,string $suffix,string $priority,string $route): void { if($count)$tasks[]=$this->task($title,"$count $suffix",$priority,$route); }
    private function task(string $title,string $subtitle,string $priority,string $route): array { return ['id'=>strtolower(str_replace(' ','-',$title)),'title'=>$title,'subtitle'=>$subtitle,'priority'=>$priority,'route'=>$route]; }
    private function activity(string $title,string $subtitle,string $status,string $occurredAt): array { return ['id'=>md5($title.$subtitle.$occurredAt),'title'=>$title,'subtitle'=>$subtitle,'status'=>$status,'occurred_at'=>$occurredAt,'time'=>$this->relativeTime($occurredAt)]; }
    private function relativeTime(string $value): string
    {
        $seconds = max(0, time() - strtotime($value));
        if ($seconds < 60) return 'just now';
        if ($seconds < 3600) return floor($seconds / 60) . ' min ago';
        if ($seconds < 86400) return floor($seconds / 3600) . ' hour(s) ago';
        return date('d M, h:i A', strtotime($value));
    }
    private function inClause(array $values): array { $values=array_values($values);return $values?[implode(',',array_fill(0,count($values),'?')),$values]:['',[]]; }
}
