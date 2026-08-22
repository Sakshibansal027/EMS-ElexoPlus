CREATE TABLE settings_employment_types (
    employment_type_id CHAR(36) PRIMARY KEY,

    employment_type_name VARCHAR(100) NOT NULL UNIQUE,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_employment_type_status
    ON settings_employment_types(status);