CREATE TABLE target_types (
    target_type_id CHAR(36) PRIMARY KEY,

    target_type_name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_target_type_status
    ON target_types(status);