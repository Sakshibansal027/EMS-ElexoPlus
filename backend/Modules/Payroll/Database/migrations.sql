USE ems_elexoplus;

-- ============================================================
-- SALARY STRUCTURE TEMPLATES
-- Master table: reusable salary structure templates (e.g.
-- "Standard CTC Template", "Sales Executive Template") that get
-- assigned to employees. created_by now references the user
-- (admin/HR) who created the template.
-- ============================================================
CREATE TABLE IF NOT EXISTS salary_structure_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    description TEXT,
    effective_from DATE,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_by INT UNSIGNED,   -- was INT, no FK
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)   
);

-- ============================================================
-- SALARY COMPONENT MASTERS
-- Master table: individual salary components (Basic, HRA, PF,
-- etc.) with their type (Earning/Deduction/Employer Contribution)
-- and how they're calculated (Fixed/Percentage/Formula), plus
-- whether they affect tax/PF/ESI.
-- ============================================================
CREATE TABLE IF NOT EXISTS salary_component_masters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    component_name VARCHAR(100) NOT NULL,
    component_code VARCHAR(30) UNIQUE,
    component_type ENUM(
        'Earning',
        'Deduction',
        'Employer Contribution'
    ) NOT NULL,
    calculation_type ENUM(
        'Fixed',
        'Percentage',
        'Formula'
    ) NOT NULL,
    taxable BOOLEAN DEFAULT TRUE,
    affects_pf BOOLEAN DEFAULT FALSE,
    affects_esi BOOLEAN DEFAULT FALSE,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TEMPLATE COMPONENTS
-- Breakup of a template: which components make it up, with
-- either a fixed amount or a percentage, display order, and
-- whether the component is mandatory. Added a UNIQUE constraint
-- so the same component can't be added twice to one template.
-- ============================================================
CREATE TABLE IF NOT EXISTS template_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    component_id INT NOT NULL,
    amount DECIMAL(12,2),
    percentage DECIMAL(8,2),
    calculation_basis VARCHAR(100),
    display_order INT DEFAULT 1,
    is_mandatory BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_template_component (template_id, component_id),   
    FOREIGN KEY (template_id)
        REFERENCES salary_structure_templates(id),
    FOREIGN KEY (component_id)
        REFERENCES salary_component_masters(id)
);

-- ============================================================
-- EMPLOYEE SALARY STRUCTURES
-- Which salary structure template is assigned to which employee,
-- for what effective date range, and the resulting annual/monthly
-- figures.
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_salary_structures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,   
    template_id INT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    annual_ctc DECIMAL(12,2),
    monthly_gross DECIMAL(12,2),
    status ENUM(
        'Active',
        'Expired'
    ) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id),   
    FOREIGN KEY (template_id)
        REFERENCES salary_structure_templates(id)
);

-- ============================================================
-- EMPLOYEE SALARY COMPONENTS
-- Breakup of the salary structure actually assigned to a given
-- employee (mirrors template_components but per-employee, so it
-- can be overridden individually).
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_salary_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_salary_structure_id INT NOT NULL,
    component_id INT NOT NULL,
    amount DECIMAL(12,2),
    percentage DECIMAL(8,2),
    calculated_amount DECIMAL(12,2),
    FOREIGN KEY (employee_salary_structure_id)
        REFERENCES employee_salary_structures(id),
    FOREIGN KEY (component_id)
        REFERENCES salary_component_masters(id)
);

-- ============================================================
-- PAYROLL PERIODS
-- Which payroll month/year is currently being run, its status
-- through the workflow (Draft -> Processing -> Verification ->
-- Completed -> Locked), and who processed/locked it.
-- ============================================================
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
    processed_by INT UNSIGNED,   
    processed_at TIMESTAMP NULL,
    locked_by INT UNSIGNED,      
    locked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_payroll_period (payroll_month, payroll_year),
    FOREIGN KEY (processed_by) REFERENCES users(id),   -- was missing
    FOREIGN KEY (locked_by) REFERENCES users(id)        -- was missing
);

-- ============================================================
-- PAYROLL PROCESSING
-- Employee-wise payroll computation for a given payroll period:
-- attendance/payable/LOP days, overtime, incentives, deductions,
-- gross/net salary, and its own verification + status workflow.
-- ============================================================
CREATE TABLE IF NOT EXISTS payroll_processing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id INT NOT NULL,
    employee_id INT UNSIGNED NOT NULL,   
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
    verified_by INT UNSIGNED,   
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
        REFERENCES payroll_periods(id),
    FOREIGN KEY (employee_id) REFERENCES users(id),   -- was missing
    FOREIGN KEY (verified_by) REFERENCES users(id)     -- was missing
);

-- ============================================================
-- PAYROLL DETAILS
-- Component-wise breakup of a specific employee's payroll for a
-- specific period (mirrors employee_salary_components, but this
-- is the actual computed/paid breakup for that month).
-- ============================================================
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

-- ============================================================
-- SALARY REVISIONS
-- History of salary/template changes for an employee: previous
-- vs new template and CTC, reason, effective date, and who made
-- the revision.
-- ============================================================
CREATE TABLE IF NOT EXISTS salary_revisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,   
    previous_template_id INT,
    new_template_id INT,
    previous_ctc DECIMAL(12,2),
    revised_ctc DECIMAL(12,2),
    revision_reason VARCHAR(255),
    effective_date DATE NOT NULL,
    revised_by INT UNSIGNED,  
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id),   
    FOREIGN KEY (previous_template_id)
        REFERENCES salary_structure_templates(id),
    FOREIGN KEY (new_template_id)
        REFERENCES salary_structure_templates(id),
    FOREIGN KEY (revised_by) REFERENCES users(id)      
);

-- ============================================================
-- BANK TRANSFER BATCHES
-- Batch file generated for a payroll period to send to the bank
-- for salary disbursal, with status tracking through
-- Pending -> Generated -> Uploaded -> Completed.
-- ============================================================
CREATE TABLE IF NOT EXISTS bank_transfer_batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id INT NOT NULL,
    batch_reference VARCHAR(100),
    file_name VARCHAR(255),
    generated_by INT UNSIGNED,   
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
        REFERENCES payroll_periods(id),
    FOREIGN KEY (generated_by) REFERENCES users(id)  
);