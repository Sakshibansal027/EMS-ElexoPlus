CREATE TABLE territory_assignments (
    assignment_id CHAR(36) PRIMARY KEY,

    territory_id CHAR(36) NOT NULL,

    assigned_to_employee_id CHAR(36) NOT NULL,

    assigned_by_employee_id CHAR(36) NOT NULL,

    assigned_date DATE NOT NULL DEFAULT (CURRENT_DATE),

    effective_from DATE NOT NULL,

    effective_to DATE NULL,

    status ENUM(
        'Active',
        'Inactive',
        'Completed'
    ) NOT NULL DEFAULT 'Active',

    remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_territory_assignment_territory
        FOREIGN KEY (territory_id)
        REFERENCES territories(territory_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_territory_assignment_employee
        FOREIGN KEY (assigned_to_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_territory_assignment_assigned_by
        FOREIGN KEY (assigned_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_territory_assignment_dates
        CHECK (
            effective_to IS NULL
            OR effective_to >= effective_from
        )
);

CREATE INDEX idx_territory_assignment_territory
    ON territory_assignments(territory_id);

CREATE INDEX idx_territory_assignment_employee
    ON territory_assignments(assigned_to_employee_id);

CREATE INDEX idx_territory_assignment_assigned_by
    ON territory_assignments(assigned_by_employee_id);

CREATE INDEX idx_territory_assignment_status
    ON territory_assignments(status);