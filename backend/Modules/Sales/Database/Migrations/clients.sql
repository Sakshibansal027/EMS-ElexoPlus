USE employee_management_system;

CREATE TABLE clients (
    client_id CHAR(36) PRIMARY KEY,

    lead_id CHAR(36) NULL,

    client_name VARCHAR(150) NOT NULL,

    contact_person VARCHAR(150) NULL,

    phone_number VARCHAR(20) NOT NULL,

    email VARCHAR(255) NULL,

    address TEXT NULL,

    city VARCHAR(100) NULL,

    state VARCHAR(100) NULL,

    pincode VARCHAR(20) NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    assigned_employee_id CHAR(36) NOT NULL,

    remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_client_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_client_assigned_employee
        FOREIGN KEY (assigned_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_client_lead
    ON clients(lead_id);

CREATE INDEX idx_client_assigned_employee
    ON clients(assigned_employee_id);

CREATE INDEX idx_client_status
    ON clients(status);

CREATE INDEX idx_client_city
    ON clients(city);

CREATE INDEX idx_client_state
    ON clients(state);