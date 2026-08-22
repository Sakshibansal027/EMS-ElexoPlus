CREATE TABLE employee_addresses (
    address_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    address_type ENUM(
        'Current',
        'Permanent'
    ) NOT NULL,

    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255) NULL,

    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_address_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE employee_bank_accounts (
    bank_account_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    bank_name VARCHAR(150) NOT NULL,

    account_number VARCHAR(50) NOT NULL,

    ifsc_code VARCHAR(20) NOT NULL,

    is_primary BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_bank_account_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE employee_statutory_details (
    statutory_detail_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL UNIQUE,

    pan_number VARCHAR(20) NOT NULL,

    aadhaar_number VARCHAR(20) NOT NULL,

    uan_number VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_statutory_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
