CREATE TABLE salary_revisions (
    salary_revision_id CHAR(36) PRIMARY KEY,
    employee_id CHAR(36) NOT NULL,
    current_salary DECIMAL(12,2) NOT NULL,
    requested_salary DECIMAL(12,2) NOT NULL,
    effective_from DATE NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
    requested_by CHAR(36) NULL,
    reviewed_by CHAR(36) NULL,
    review_notes TEXT NULL,
    reviewed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_salary_revision_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_salary_revision_amounts
        CHECK (current_salary >= 0 AND requested_salary > 0)
);

CREATE INDEX idx_salary_revision_employee_status
    ON salary_revisions(employee_id, status);
CREATE INDEX idx_salary_revision_status_created
    ON salary_revisions(status, created_at);
