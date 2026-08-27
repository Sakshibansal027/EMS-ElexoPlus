USE employee_management_system;

CREATE TABLE salary_structures (
    salary_structure_id CHAR(36) PRIMARY KEY,

    structure_name VARCHAR(150) NOT NULL,

    structure_code VARCHAR(50) NOT NULL UNIQUE,

    basic_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,

    hra_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,

    special_allowance DECIMAL(12,2) NOT NULL DEFAULT 0,

    medical_allowance DECIMAL(12,2) NOT NULL DEFAULT 0,

    conveyance_allowance DECIMAL(12,2) NOT NULL DEFAULT 0,

    bonus_type VARCHAR(50) NULL,

    bonus_value DECIMAL(12,2) NOT NULL DEFAULT 0,

    bonus_frequency VARCHAR(50) NULL,

    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_salary_structure_percentages
        CHECK (
            basic_percentage >= 0
            AND hra_percentage >= 0
        ),

    CONSTRAINT chk_salary_structure_amounts
        CHECK (
            special_allowance >= 0
            AND medical_allowance >= 0
            AND conveyance_allowance >= 0
            AND bonus_value >= 0
        )
);
