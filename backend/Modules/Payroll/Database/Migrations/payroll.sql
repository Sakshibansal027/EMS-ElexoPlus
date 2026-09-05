CREATE TABLE payroll_periods (
    payroll_period_id CHAR(36) PRIMARY KEY,

    payroll_month TINYINT NOT NULL,

    payroll_year YEAR NOT NULL,

    period_start DATE NOT NULL,

    period_end DATE NOT NULL,

    status ENUM(
        'Draft',
        'Processing',
        'Verification',
        'Completed',
        'Locked'
    ) NOT NULL DEFAULT 'Draft',

    processed_by CHAR(36) NULL,

    processed_at DATETIME NULL,

    locked_by CHAR(36) NULL,

    locked_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_payroll_period
        UNIQUE (payroll_month, payroll_year),

    CONSTRAINT chk_payroll_month
        CHECK (payroll_month BETWEEN 1 AND 12),

    CONSTRAINT chk_payroll_period_dates
        CHECK (period_end >= period_start),

    -- Users may use either the legacy integer primary key or UUID user_id.
    -- Audit identifiers are intentionally stored without a foreign key so the
    -- Payroll schema works with both supported authentication schemas.
    INDEX idx_payroll_period_processed_by (processed_by),
    INDEX idx_payroll_period_locked_by (locked_by)
);

CREATE INDEX idx_payroll_period_status
    ON payroll_periods(status);

CREATE INDEX idx_payroll_period_dates
    ON payroll_periods(period_start, period_end);
USE employee_management_system;

CREATE TABLE payrolls (
    payroll_id CHAR(36) PRIMARY KEY,

    payroll_period_id CHAR(36) NOT NULL,

    employee_id CHAR(36) NOT NULL,

    salary_structure_id CHAR(36) NOT NULL,

    attendance_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    payable_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    lop_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    overtime_hours DECIMAL(5,2) NOT NULL DEFAULT 0,

    gross_salary DECIMAL(12,2) NOT NULL DEFAULT 0,

    total_incentives DECIMAL(12,2) NOT NULL DEFAULT 0,

    total_deductions DECIMAL(12,2) NOT NULL DEFAULT 0,

    net_salary DECIMAL(12,2) NOT NULL DEFAULT 0,

    verification_status ENUM(
        'Pending',
        'Verified',
        'Rejected'
    ) NOT NULL DEFAULT 'Pending',

    verified_by CHAR(36) NULL,

    verified_at DATETIME NULL,

    payroll_status ENUM(
        'Draft',
        'Processing',
        'Approved',
        'Paid'
    ) NOT NULL DEFAULT 'Draft',

    processed_by CHAR(36) NULL,

    processed_at DATETIME NULL,

    approved_by CHAR(36) NULL,

    approved_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_payroll_employee_period
        UNIQUE (
            payroll_period_id,
            employee_id
        ),

    CONSTRAINT fk_payroll_period
        FOREIGN KEY (payroll_period_id)
        REFERENCES payroll_periods(payroll_period_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_payroll_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_payroll_salary_structure
        FOREIGN KEY (salary_structure_id)
        REFERENCES salary_structures(salary_structure_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_payroll_amounts
        CHECK (
            attendance_days >= 0
            AND payable_days >= 0
            AND lop_days >= 0
            AND overtime_hours >= 0
            AND gross_salary >= 0
            AND total_incentives >= 0
            AND total_deductions >= 0
            AND net_salary >= 0
        )
);

CREATE INDEX idx_payroll_employee
    ON payrolls(employee_id);

CREATE INDEX idx_payroll_period
    ON payrolls(payroll_period_id);

CREATE INDEX idx_payroll_status
    ON payrolls(payroll_status);

CREATE INDEX idx_payroll_verification
    ON payrolls(verification_status);

CREATE INDEX idx_payroll_salary_structure
    ON payrolls(salary_structure_id);
