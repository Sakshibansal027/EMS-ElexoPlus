CREATE TABLE payroll_bank_transfers (
    payroll_bank_transfer_id CHAR(36) PRIMARY KEY,
    payroll_id CHAR(36) NOT NULL,
    employee_id CHAR(36) NOT NULL,
    bank_name VARCHAR(150) NULL,
    account_last_four CHAR(4) NULL,
    ifsc_code VARCHAR(20) NULL,
    amount DECIMAL(12,2) NOT NULL,
    status ENUM('Ready','Dispatched','Failed') NOT NULL DEFAULT 'Ready',
    transaction_reference VARCHAR(100) NULL,
    dispatched_by CHAR(36) NULL,
    dispatched_at DATETIME NULL,
    failure_reason VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_payroll_bank_transfer UNIQUE (payroll_id),
    CONSTRAINT fk_payroll_bank_transfer_payroll
        FOREIGN KEY (payroll_id) REFERENCES payrolls(payroll_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payroll_bank_transfer_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_payroll_bank_transfer_amount CHECK (amount >= 0)
);

CREATE INDEX idx_payroll_bank_transfer_status
    ON payroll_bank_transfers(status, created_at);
