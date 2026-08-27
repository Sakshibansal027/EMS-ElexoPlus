CREATE TABLE employee_salary_structures (
    employee_salary_structure_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    salary_structure_id CHAR(36) NOT NULL,

    effective_from DATE NOT NULL,

    effective_to DATE NULL,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_salary_structure_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_employee_salary_structure_structure
        FOREIGN KEY (salary_structure_id)
        REFERENCES salary_structures(salary_structure_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_salary_structure_dates
        CHECK (
            effective_to IS NULL
            OR effective_to >= effective_from
        )
);

CREATE INDEX idx_employee_salary_structure_employee
    ON employee_salary_structures(employee_id);

CREATE INDEX idx_employee_salary_structure_structure
    ON employee_salary_structures(salary_structure_id);

CREATE INDEX idx_employee_salary_structure_status
    ON employee_salary_structures(status);

CREATE UNIQUE INDEX uq_employee_salary_structure_effective_from
    ON employee_salary_structures(employee_id, effective_from);
