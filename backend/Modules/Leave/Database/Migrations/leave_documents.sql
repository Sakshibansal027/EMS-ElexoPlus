CREATE TABLE leave_application_documents (
    document_id CHAR(36) PRIMARY KEY,

    leave_application_id CHAR(36) NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_url VARCHAR(500) NOT NULL,

    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_leave_document_application
        FOREIGN KEY (leave_application_id)
        REFERENCES leave_applications(leave_application_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_leave_document_application
    ON leave_application_documents(leave_application_id);