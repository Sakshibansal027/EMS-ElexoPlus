USE employee_management_system;

CREATE TABLE leads (
    lead_id CHAR(36) PRIMARY KEY,

    segment ENUM(
        'B2B',
        'B2C'
    ) NOT NULL,

    lead_name VARCHAR(255) NOT NULL,

    company_name VARCHAR(255) NULL,

    contact_person VARCHAR(255) NULL,

    phone_number VARCHAR(20) NOT NULL,

    email VARCHAR(255) NULL,

    requirement TEXT NULL,

    estimated_value DECIMAL(12,2) NOT NULL DEFAULT 0,

    gst_number VARCHAR(30) NULL,

    assigned_employee_id CHAR(36) NOT NULL,

    lead_source ENUM(
        'Reference',
        'Website',
        'Social Media',
        'Walk-In',
        'Cold Calling',
        'Other'
    ) NULL,

    lead_priority ENUM(
        'Low',
        'Medium',
        'High'
    ) NOT NULL DEFAULT 'Medium',

    current_status ENUM(
        'New Lead',
        'Contacted',
        'Proposal Sent',
        'In Negotiation',
        'Closed',
        'Archived'
    ) NOT NULL DEFAULT 'New Lead',

    region VARCHAR(100) NULL,

    next_follow_up_date DATE NULL,

    remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lead_assigned_employee
        FOREIGN KEY (assigned_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_lead_estimated_value
        CHECK (estimated_value >= 0)
);

CREATE INDEX idx_lead_assigned_employee
    ON leads(assigned_employee_id);

CREATE INDEX idx_lead_status
    ON leads(current_status);

CREATE INDEX idx_lead_segment
    ON leads(segment);

CREATE INDEX idx_lead_priority
    ON leads(lead_priority);

CREATE INDEX idx_lead_phone
    ON leads(phone_number);
