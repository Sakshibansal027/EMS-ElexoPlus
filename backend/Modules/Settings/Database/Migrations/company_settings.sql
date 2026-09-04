CREATE TABLE IF NOT EXISTS company_settings (
    company_setting_id CHAR(36) PRIMARY KEY,

    company_name VARCHAR(150) NOT NULL,

    tagline VARCHAR(255) NULL,

    email VARCHAR(255) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    website VARCHAR(255) NULL,

    address TEXT NULL,

    city VARCHAR(100) NULL,

    state VARCHAR(100) NULL,

    country VARCHAR(100) NOT NULL,

    pincode VARCHAR(20) NULL,

    working_days JSON NOT NULL,

    working_hours_start TIME NOT NULL,

    working_hours_end TIME NOT NULL,

    timezone VARCHAR(100) NOT NULL,

    date_format VARCHAR(30) NOT NULL,

    currency VARCHAR(10) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_company_settings
        UNIQUE (company_setting_id)
);
