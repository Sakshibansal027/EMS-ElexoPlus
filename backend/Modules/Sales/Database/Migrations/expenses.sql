USE employee_management_system;

CREATE TABLE expenses (
    expense_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    expense_date DATE NOT NULL,

    expense_type ENUM(
        'Travel',
        'Meeting',
        'Client Visit',
        'Other'
    ) NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    description TEXT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) NOT NULL DEFAULT 'Pending',

    reviewed_by_employee_id CHAR(36) NULL,

    reviewed_at DATETIME NULL,

    review_remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_expense_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_expense_reviewer
        FOREIGN KEY (reviewed_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_expense_amount
        CHECK (amount >= 0)
);

CREATE INDEX idx_expense_employee
    ON expenses(employee_id);

CREATE INDEX idx_expense_date
    ON expenses(expense_date);

CREATE INDEX idx_expense_status
    ON expenses(status);

CREATE INDEX idx_expense_reviewer
    ON expenses(reviewed_by_employee_id);