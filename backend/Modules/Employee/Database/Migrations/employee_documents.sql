CREATE TABLE employee_documents (
    document_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    document_name VARCHAR(255) NOT NULL,

    document_url VARCHAR(500) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'Pending',

    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    verified_at TIMESTAMP NULL,

    verified_by CHAR(36) NULL,

    CONSTRAINT fk_employee_document_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);  