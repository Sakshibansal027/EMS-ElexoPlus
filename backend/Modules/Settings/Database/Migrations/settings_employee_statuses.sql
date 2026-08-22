CREATE TABLE employee_statuses (
    employee_status_id CHAR(36) PRIMARY KEY,

    status_name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_employee_status_status
    ON employee_statuses(status);