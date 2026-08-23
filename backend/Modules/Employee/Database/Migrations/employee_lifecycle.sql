CREATE TABLE employee_transfers (
    transfer_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    from_department_id CHAR(36) NULL,
    to_department_id CHAR(36) NOT NULL,

    from_designation_id CHAR(36) NULL,
    to_designation_id CHAR(36) NOT NULL,

    from_reporting_manager_id CHAR(36) NULL,
    to_reporting_manager_id CHAR(36) NULL,

    transfer_date DATE NOT NULL,

    transfer_reason TEXT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Completed'
    ) NOT NULL DEFAULT 'Pending',

    approved_by CHAR(36) NULL,
    approved_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transfer_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transfer_from_department
        FOREIGN KEY (from_department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transfer_to_department
        FOREIGN KEY (to_department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transfer_from_designation
        FOREIGN KEY (from_designation_id)
        REFERENCES designations(designation_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transfer_to_designation
        FOREIGN KEY (to_designation_id)
        REFERENCES designations(designation_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transfer_from_manager
        FOREIGN KEY (from_reporting_manager_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_transfer_to_manager
        FOREIGN KEY (to_reporting_manager_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
CREATE TABLE employee_exits (
    exit_id CHAR(36) PRIMARY KEY,

    employee_id CHAR(36) NOT NULL,

    exit_type VARCHAR(50) NOT NULL,

    resignation_date DATE NULL,

    notice_period_days INT NULL,

    last_working_date DATE NOT NULL,

    exit_reason TEXT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Completed'
    ) NOT NULL DEFAULT 'Pending',

    approved_by CHAR(36) NULL,

    approved_at TIMESTAMP NULL,

    remarks TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_exit_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
