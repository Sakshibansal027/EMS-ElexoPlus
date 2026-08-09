USE ems_elexoplus;
//kis employee ko konsa salary structure assign hua hai
CREATE TABLE IF NOT EXISTS employee_salary_structures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    template_id INT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    annual_ctc DECIMAL(12,2),
    monthly_gross DECIMAL(12,2),
    status ENUM(
        'Active',
        'Expired'
    ) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id)
        REFERENCES salary_structure_templates(id)
);

//breakup of salary structure assigned
CREATE TABLE IF NOT EXISTS employee_salary_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_salary_structure_id INT NOT NULL,
    component_id INT NOT NULL,
    amount DECIMAL(12,2),
    percentage DECIMAL(8,2),
    calculated_amount DECIMAL(12,2),
    FOREIGN KEY (employee_salary_structure_id)
        REFERENCES employee_salary_structures(id),
    FOREIGN KEY (component_id)
        REFERENCES salary_component_masters(id)
);