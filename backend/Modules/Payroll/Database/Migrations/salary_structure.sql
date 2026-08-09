USE ems_elexoplus;

CREATE TABLE IF NOT EXISTS salary_structure_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    description TEXT,
    effective_from DATE,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salary_component_masters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    component_name VARCHAR(100) NOT NULL,
    component_code VARCHAR(30) UNIQUE,
    component_type ENUM(
        'Earning',
        'Deduction',
        'Employer Contribution'
    ) NOT NULL,
    calculation_type ENUM(
        'Fixed',
        'Percentage',
        'Formula'
    ) NOT NULL,
    taxable BOOLEAN DEFAULT TRUE,
    affects_pf BOOLEAN DEFAULT FALSE,
    affects_esi BOOLEAN DEFAULT FALSE,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS template_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    component_id INT NOT NULL,
    amount DECIMAL(12,2),
    percentage DECIMAL(8,2),
    calculation_basis VARCHAR(100),
    display_order INT DEFAULT 1,
    is_mandatory BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (template_id)
        REFERENCES salary_structure_templates(id),

    FOREIGN KEY (component_id)
        REFERENCES salary_component_masters(id)
);