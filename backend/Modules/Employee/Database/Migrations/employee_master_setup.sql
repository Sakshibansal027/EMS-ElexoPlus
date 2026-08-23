-- Self-contained Employee Master schema. Every statement is idempotent so it
-- can be safely run on a fresh database or a database where some tables exist.
CREATE TABLE IF NOT EXISTS departments (
    department_id CHAR(36) PRIMARY KEY,
    department_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS designations (
    designation_id CHAR(36) PRIMARY KEY,
    designation_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employment_types (
    employment_type_id CHAR(36) PRIMARY KEY,
    employment_type_name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_locations (
    work_location_id CHAR(36) PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL UNIQUE,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_statuses (
    employee_status_id CHAR(36) PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id CHAR(36) PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    gender ENUM('Male','Female','Other') NOT NULL,
    date_of_birth DATE NULL,
    department_id CHAR(36) NOT NULL,
    designation_id CHAR(36) NOT NULL,
    reporting_manager_id CHAR(36) NULL,
    date_of_joining DATE NOT NULL,
    employment_type_id CHAR(36) NOT NULL,
    work_location_id CHAR(36) NOT NULL,
    employee_status_id CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CONSTRAINT fk_employee_designation FOREIGN KEY (designation_id) REFERENCES designations(designation_id),
    CONSTRAINT fk_employee_manager FOREIGN KEY (reporting_manager_id) REFERENCES employees(employee_id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_type FOREIGN KEY (employment_type_id) REFERENCES employment_types(employment_type_id),
    CONSTRAINT fk_employee_location FOREIGN KEY (work_location_id) REFERENCES work_locations(work_location_id),
    CONSTRAINT fk_employee_status FOREIGN KEY (employee_status_id) REFERENCES employee_statuses(employee_status_id)
);

INSERT IGNORE INTO departments (department_id, department_name) VALUES
('00000000-0000-4000-8000-000000000001','Administration'),
('00000000-0000-4000-8000-000000000002','Human Resources'),
('00000000-0000-4000-8000-000000000003','Sales'),
('00000000-0000-4000-8000-000000000004','Operations');
INSERT IGNORE INTO designations (designation_id, designation_name) VALUES
('00000000-0000-4000-8000-000000000011','Administrator'),
('00000000-0000-4000-8000-000000000012','HR Manager'),
('00000000-0000-4000-8000-000000000013','Area Sales Manager'),
('00000000-0000-4000-8000-000000000014','Sales Executive');
INSERT IGNORE INTO employment_types (employment_type_id, employment_type_name) VALUES
('00000000-0000-4000-8000-000000000021','Full Time'),
('00000000-0000-4000-8000-000000000022','Part Time'),
('00000000-0000-4000-8000-000000000023','Contract');
INSERT IGNORE INTO work_locations (work_location_id, location_name) VALUES
('00000000-0000-4000-8000-000000000031','Head Office'),
('00000000-0000-4000-8000-000000000032','Delhi'),
('00000000-0000-4000-8000-000000000033','Remote');
INSERT IGNORE INTO employee_statuses (employee_status_id, status_name) VALUES
('00000000-0000-4000-8000-000000000041','Active'),
('00000000-0000-4000-8000-000000000042','Inactive');
