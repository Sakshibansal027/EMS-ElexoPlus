CREATE TABLE settings_work_locations (
    work_location_id CHAR(36) PRIMARY KEY,

    location_name VARCHAR(150) NOT NULL UNIQUE,

    description TEXT NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_location_status
    ON work_locations(status);