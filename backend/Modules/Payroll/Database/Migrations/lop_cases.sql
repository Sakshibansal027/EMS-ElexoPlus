CREATE TABLE lop_cases (
    lop_case_id CHAR(36) PRIMARY KEY,
    employee_id CHAR(36) NOT NULL,
    payroll_period_id CHAR(36) NULL,
    payroll_id CHAR(36) NULL,
    days_missed DECIMAL(5,2) NOT NULL,
    deduction_amount DECIMAL(12,2) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status ENUM('Pending','Resolved','Waived') NOT NULL DEFAULT 'Pending',
    resolution_notes TEXT NULL,
    resolved_by CHAR(36) NULL,
    resolved_at DATETIME NULL,
    applied_deduction_id CHAR(36) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lop_case_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lop_case_period
        FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(payroll_period_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lop_case_payroll
        FOREIGN KEY (payroll_id) REFERENCES payrolls(payroll_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_lop_case_amounts
        CHECK (days_missed > 0 AND deduction_amount >= 0)
);

CREATE INDEX idx_lop_case_employee_status
    ON lop_cases(employee_id, status);
CREATE INDEX idx_lop_case_period_status
    ON lop_cases(payroll_period_id, status);
