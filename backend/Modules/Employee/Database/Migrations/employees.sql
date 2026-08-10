CREATE TABLE employees (
    employee_id CHAR(36) PRIMARY KEY,

    employee_code VARCHAR(50) NOT NULL UNIQUE,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,

    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NULL,
    blood_group VARCHAR(5) NULL,

    emergency_contact_name VARCHAR(150) NULL,
    emergency_contact_relationship VARCHAR(50) NULL,
    emergency_contact_phone VARCHAR(20) NULL,

    department_id CHAR(36) NOT NULL,
    designation_id CHAR(36) NOT NULL,
    reporting_manager_id CHAR(36) NULL,

    date_of_joining DATE NOT NULL,

    employment_type_id CHAR(36) NOT NULL,
    work_location_id CHAR(36) NOT NULL,

    employee_status_id CHAR(36) NOT NULL

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id),

    CONSTRAINT fk_employee_designation
        FOREIGN KEY (designation_id)
        REFERENCES designations(designation_id),

    CONSTRAINT fk_employee_manager
        FOREIGN KEY (reporting_manager_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL

    CONSTRAINT fk_employee_employment_type
    FOREIGN KEY (employment_type_id)
    REFERENCES employment_types(employment_type_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

    CONSTRAINT fk_employee_work_location
    FOREIGN KEY (work_location_id)
    REFERENCES work_locations(work_location_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE

    CONSTRAINT fk_employee_status
    FOREIGN KEY (employee_status_id)
    REFERENCES employee_statuses(employee_status_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE INDEX idx_employee_employment_type
    ON employees(employment_type_id);

CREATE INDEX idx_employee_work_location
    ON employees(work_location_id);

CREATE INDEX idx_employee_status
    ON employees(employee_status_id);