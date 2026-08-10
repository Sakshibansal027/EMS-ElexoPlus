CREATE TABLE leave_applications (
    leave_application_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    leave_policy_id CHAR(36) NOT NULL,

    from_date DATE NOT NULL,

    to_date DATE NOT NULL,

    day_type ENUM(
        'Full Day',
        'First Half',
        'Second Half'
    ) NOT NULL DEFAULT 'Full Day',

    reason TEXT NOT NULL,

    emergency_contact VARCHAR(20) NOT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reviewed_by CHAR(36) NULL,

    reviewed_at DATETIME NULL,

    review_comment TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_leave_application_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_leave_application_policy
        FOREIGN KEY (leave_policy_id)
        REFERENCES leave_policies(leave_policy_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_leave_application_reviewer
        FOREIGN KEY (reviewed_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_leave_application_dates
        CHECK (to_date >= from_date)
);

CREATE INDEX idx_leave_application_employee
    ON leave_applications(employee_id);

CREATE INDEX idx_leave_application_policy
    ON leave_applications(leave_policy_id);

CREATE INDEX idx_leave_application_status
    ON leave_applications(status);

CREATE INDEX idx_leave_application_dates
    ON leave_applications(from_date, to_date);