CREATE TABLE settings_designations (
    designation_id CHAR(36) PRIMARY KEY,

    designation_name VARCHAR(150) NOT NULL,

    department_id CHAR(36) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_settings_designation_department
        UNIQUE (designation_name, department_id),

    CONSTRAINT fk_settings_designation_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_settings_designation_department
    ON settings_designations(department_id);