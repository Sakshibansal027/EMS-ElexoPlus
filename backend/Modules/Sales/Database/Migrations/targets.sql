USE employee_management_system;

CREATE TABLE targets (
    target_id CHAR(36) PRIMARY KEY,

    target_type_id CHAR(36) NOT NULL,

    assigned_to_employee_id CHAR(36) NOT NULL,

    territory_id CHAR(36) NULL,

    target_period ENUM(
        'Monthly',
        'Quarterly',
        'Yearly'
    ) NOT NULL,

    period_start DATE NOT NULL,

    period_end DATE NOT NULL,

    target_value DECIMAL(12,2) NOT NULL,

    achieved_value DECIMAL(12,2) NOT NULL DEFAULT 0,

    status ENUM(
        'Active',
        'Inactive',
        'Completed'
    ) NOT NULL DEFAULT 'Active',

    assigned_by_employee_id CHAR(36) NOT NULL,

    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_target_type
        FOREIGN KEY (target_type_id)
        REFERENCES target_types(target_type_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_target_assigned_to
        FOREIGN KEY (assigned_to_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_target_territory
        FOREIGN KEY (territory_id)
        REFERENCES territories(territory_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_target_assigned_by
        FOREIGN KEY (assigned_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_target_dates
        CHECK (period_end >= period_start),

    CONSTRAINT chk_target_values
        CHECK (
            target_value >= 0
            AND achieved_value >= 0
        )
);

CREATE INDEX idx_target_type
    ON targets(target_type_id);

CREATE INDEX idx_target_assigned_to
    ON targets(assigned_to_employee_id);

CREATE INDEX idx_target_territory
    ON targets(territory_id);

CREATE INDEX idx_target_period
    ON targets(period_start, period_end);

CREATE INDEX idx_target_status
    ON targets(status);