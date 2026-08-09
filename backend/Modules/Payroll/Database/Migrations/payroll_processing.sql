USE ems_elexoplus;

//kis month ka payroll chal rha h
CREATE TABLE IF NOT EXISTS payroll_periods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_month TINYINT NOT NULL,
    payroll_year YEAR NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    payroll_status ENUM(
        'Draft',
        'Processing',
        'Verification',
        'Completed',
        'Locked'
    ) DEFAULT 'Draft',
    processed_by INT,
    processed_at TIMESTAMP NULL,
    locked_by INT,
    locked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_payroll_period (payroll_month, payroll_year)
);

//employee wise payroll details
CREATE TABLE IF NOT EXISTS payroll_processing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id INT NOT NULL,
    employee_id INT NOT NULL,
    attendance_days DECIMAL(5,2),
    payable_days DECIMAL(5,2),
    lop_days DECIMAL(5,2),
    overtime_hours DECIMAL(5,2),
    incentive_amount DECIMAL(12,2),
    deduction_amount DECIMAL(12,2),
    gross_salary DECIMAL(12,2),
    net_salary DECIMAL(12,2),
    verification_status ENUM(
        'Pending',
        'Verified',
        'Rejected'
    ) DEFAULT 'Pending',
    verified_by INT,
    verified_at TIMESTAMP NULL,
    payroll_status ENUM(
        'Draft',
        'Processed',
        'Locked'
    ) DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_period_id)
        REFERENCES payroll_periods(id)
);

//us particular month ka salary breakup
CREATE TABLE IF NOT EXISTS payroll_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_processing_id INT NOT NULL,
    component_id INT NOT NULL,
    component_amount DECIMAL(12,2),
    remarks VARCHAR(255),
    FOREIGN KEY (payroll_processing_id)
        REFERENCES payroll_processing(id),
    FOREIGN KEY (component_id)
        REFERENCES salary_component_masters(id)
);

//maintain history of payroll
CREATE TABLE IF NOT EXISTS salary_revisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    previous_template_id INT,
    new_template_id INT,
    previous_ctc DECIMAL(12,2),
    revised_ctc DECIMAL(12,2),
    revision_reason VARCHAR(255),
    effective_date DATE NOT NULL,
    revised_by INT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (previous_template_id)
        REFERENCES salary_structure_templates(id),
    FOREIGN KEY (new_template_id)
        REFERENCES salary_structure_templates(id)
);


CREATE TABLE IF NOT EXISTS bank_transfer_batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id INT NOT NULL,
    batch_reference VARCHAR(100),
    file_name VARCHAR(255),
    generated_by INT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transfer_status ENUM(
        'Pending',
        'Generated',
        'Uploaded',
        'Completed'
    ) DEFAULT 'Pending',
    total_employees INT,
    total_amount DECIMAL(14,2),
    FOREIGN KEY (payroll_period_id)
        REFERENCES payroll_periods(id)
);