CREATE TABLE departments (
    department_id CHAR(36) PRIMARY KEY,

    department_name VARCHAR(150) NOT NULL UNIQUE,

    head_employee_id CHAR(36) NULL,

    description TEXT NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_department_head
        FOREIGN KEY (head_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_department_status
    ON departments(status);

CREATE INDEX idx_department_head
    ON departments(head_employee_id);