CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,

    -- A user may be created before its employee profile is completed.
    employee_id CHAR(36) NULL UNIQUE,

    username VARCHAR(50) NOT NULL UNIQUE,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    name VARCHAR(150) NULL,
    designation VARCHAR(100) NULL,
    avatar VARCHAR(500) NULL,
    role ENUM('ADMIN', 'HR', 'ASM', 'SALES_EXECUTIVE')
        NOT NULL DEFAULT 'SALES_EXECUTIVE',

    status ENUM('Active', 'Inactive')
        NOT NULL DEFAULT 'Active',

    last_login_at DATETIME NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
