USE employee_management_system;

CREATE TABLE lead_status_history (
    history_id CHAR(36) PRIMARY KEY,

    lead_id CHAR(36) NOT NULL,

    old_status VARCHAR(50) NULL,

    new_status VARCHAR(50) NOT NULL,

    changed_by CHAR(36) NOT NULL,

    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    remarks TEXT NULL,

    CONSTRAINT fk_lead_status_history_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_lead_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_lead_status_history_lead
    ON lead_status_history(lead_id);

CREATE INDEX idx_lead_status_history_changed_by
    ON lead_status_history(changed_by);

CREATE INDEX idx_lead_status_history_changed_at
    ON lead_status_history(changed_at);