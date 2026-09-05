CREATE TABLE payroll_holds (
    payroll_hold_id CHAR(36) PRIMARY KEY,
    employee_id CHAR(36) NOT NULL,
    status ENUM('Active','Released') NOT NULL DEFAULT 'Active',
    reason VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    created_by CHAR(36) NULL,
    released_by CHAR(36) NULL,
    released_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payroll_hold_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_payroll_hold_employee_status
    ON payroll_holds(employee_id, status);
CREATE INDEX idx_payroll_hold_status_created
    ON payroll_holds(status, created_at);
