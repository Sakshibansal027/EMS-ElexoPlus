CREATE TABLE departments (
    department_id CHAR(36) PRIMARY KEY,

    department_name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT NULL,

    status ENUM('Active', 'Inactive')
        NOT NULL DEFAULT 'Active',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE designations (
    designation_id CHAR(36) PRIMARY KEY,

    designation_name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT NULL,

    status ENUM('Active', 'Inactive')
        NOT NULL DEFAULT 'Active',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE department_designations (
    department_id CHAR(36) NOT NULL,
    designation_id CHAR(36) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (department_id, designation_id),

    CONSTRAINT fk_department_designation_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_department_designation_designation
        FOREIGN KEY (designation_id)
        REFERENCES designations(designation_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
