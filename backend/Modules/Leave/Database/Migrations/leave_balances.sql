CREATE TABLE employee_leave_balances (
    leave_balance_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    leave_policy_id CHAR(36) NOT NULL,

    leave_year YEAR NOT NULL,

    allocated_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    used_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    remaining_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_employee_leave_balance
        UNIQUE (
            employee_id,
            leave_policy_id,
            leave_year
        ),

    CONSTRAINT fk_leave_balance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_leave_balance_policy
        FOREIGN KEY (leave_policy_id)
        REFERENCES leave_policies(leave_policy_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_leave_balance_values
        CHECK (
            allocated_days >= 0
            AND used_days >= 0
            AND remaining_days >= 0
        )
);

CREATE INDEX idx_leave_balance_employee
    ON employee_leave_balances(employee_id);

CREATE INDEX idx_leave_balance_year
    ON employee_leave_balances(leave_year);