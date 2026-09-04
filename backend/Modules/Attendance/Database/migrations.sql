-- ============================================================
-- EMS-ElexoPlus - Attendance Module Migration
-- ============================================================

-- ------------------------------------------------------------
-- attendance
-- Daily attendance records for employees.
--
-- employee_id intentionally remains an application-level
-- employee identifier for now. No FK is added to users because
-- the existing users table does not contain the Attendance
-- employee profile fields (department/branch).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    employee_id     VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,

    check_in       TIME NULL,
    check_out      TIME NULL,
    break_minutes  INT UNSIGNED NOT NULL DEFAULT 0,

    working_hours  DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    overtime       DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    break_started_at DATETIME NULL,

    status ENUM(
        'Present',
        'Absent',
        'Late',
        'Half Day',
        'Work From Home',
        'Leave',
        'Holiday',
        'Weekend'
    ) NOT NULL DEFAULT 'Present',

    shift          VARCHAR(100) NULL,
    remarks        TEXT NULL,

    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_attendance_employee_date
        (employee_id, attendance_date),

    KEY idx_attendance_employee
        (employee_id),

    KEY idx_attendance_date
        (attendance_date),

    KEY idx_attendance_status
        (status)

) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- attendance_corrections
-- Employee requests to correct an attendance record.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_corrections (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    employee_id         VARCHAR(50) NOT NULL,

    correction_date     DATE NOT NULL,
    requested_check_in  TIME NULL,
    requested_check_out TIME NULL,

    reason              TEXT NOT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) NOT NULL DEFAULT 'Pending',

    submitted_on        DATE NOT NULL,
    approver_employee_id CHAR(36) NULL,
    review_remarks      TEXT NULL,
    reviewed_at         DATETIME NULL,

    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_corrections_employee
        (employee_id),

    KEY idx_corrections_date
        (correction_date),

    KEY idx_corrections_status
        (status)

) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance_notifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    employee_id CHAR(36) NOT NULL,
    title VARCHAR(180) NOT NULL,
    message VARCHAR(500) NOT NULL,
    notification_type ENUM('success','warning','info') NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_attendance_notification_employee (employee_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
