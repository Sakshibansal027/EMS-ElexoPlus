CREATE TABLE attendance_records (
    attendance_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    attendance_date DATE NOT NULL,

    check_in_at DATETIME NULL,

    check_out_at DATETIME NULL,

    break_minutes INT NOT NULL DEFAULT 0,

    working_hours DECIMAL(5,2) NOT NULL DEFAULT 0,

    overtime_hours DECIMAL(5,2) NOT NULL DEFAULT 0,

    status ENUM(
        'Present',
        'Absent',
        'Late',
        'Half Day',
        'Work From Home',
        'Leave',
        'Holiday',
        'Weekend'
    ) NOT NULL,

    shift VARCHAR(100) NOT NULL,

    remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_employee_attendance_date
        UNIQUE (employee_id, attendance_date),

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_attendance_employee
    ON attendance_records(employee_id);

CREATE INDEX idx_attendance_date
    ON attendance_records(attendance_date);

CREATE INDEX idx_attendance_status
    ON attendance_records(status);
CREATE TABLE attendance_corrections (
    correction_id CHAR(36) PRIMARY KEY,

    attendance_id CHAR(36) NOT NULL,

    requested_check_in DATETIME NOT NULL,

    requested_check_out DATETIME NOT NULL,

    reason TEXT NOT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) NOT NULL DEFAULT 'Pending',

    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reviewed_by CHAR(36) NULL,

    reviewed_at DATETIME NULL,

    rejection_reason TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_correction_attendance
        FOREIGN KEY (attendance_id)
        REFERENCES attendance_records(attendance_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_correction_reviewer
        FOREIGN KEY (reviewed_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_correction_attendance
    ON attendance_corrections(attendance_id);

CREATE INDEX idx_correction_status
    ON attendance_corrections(status);
