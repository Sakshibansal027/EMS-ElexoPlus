CREATE TABLE expense_reimbursements (
    reimbursement_id CHAR(36) PRIMARY KEY,
    employee_id CHAR(36) NOT NULL,
    payroll_period_id CHAR(36) NULL,
    payroll_id CHAR(36) NULL,
    expense_type VARCHAR(150) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    notes VARCHAR(1000) NULL,
    status ENUM('Pending','Approved','Rejected','Paid') NOT NULL DEFAULT 'Pending',
    submitted_by CHAR(36) NULL,
    reviewed_by CHAR(36) NULL,
    review_notes TEXT NULL,
    reviewed_at DATETIME NULL,
    applied_incentive_id CHAR(36) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reimbursement_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_reimbursement_period
        FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(payroll_period_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_reimbursement_payroll
        FOREIGN KEY (payroll_id) REFERENCES payrolls(payroll_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_reimbursement_amount CHECK (amount > 0)
);

CREATE INDEX idx_reimbursement_employee_status
    ON expense_reimbursements(employee_id, status);
CREATE INDEX idx_reimbursement_status_created
    ON expense_reimbursements(status, created_at);
