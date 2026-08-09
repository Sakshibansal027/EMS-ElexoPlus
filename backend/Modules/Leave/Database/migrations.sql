USE ems_elexoplus;

-- ============================================================
-- LEAVE TYPES
-- Master/config table: the list of leave categories a company
-- offers (e.g. Sick Leave, Casual Leave, Earned Leave) and the
-- rules for each (quota, half-day allowed, needs a document,
-- paid/unpaid, carry-forward rules). 
-- ============================================================

CREATE TABLE IF NOT EXISTS leave_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leave_name VARCHAR(100) NOT NULL,
    leave_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    annual_quota INT NOT NULL,
    allocation_method ENUM('Pro-rata', 'Upfront') NOT NULL,
    allow_half_day BOOLEAN DEFAULT FALSE,
    requires_document BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT TRUE,
    carry_forward BOOLEAN DEFAULT FALSE,
    max_carry_forward INT DEFAULT 0,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- LEAVE BALANCES
-- Per-employee, per-leave-type, per-year running total: how many
-- days were allocated, how many used, how many pending (applied
-- but not yet approved), how many remain, and any carried-forward
-- days from the previous year. 
-- ============================================================
CREATE TABLE IF NOT EXISTS leave_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,   
    leave_type_id INT NOT NULL,
    leave_year YEAR NOT NULL,
    allocated_days DECIMAL(5,2) DEFAULT 0,
    used_days DECIMAL(5,2) DEFAULT 0,
    pending_days DECIMAL(5,2) DEFAULT 0,
    remaining_days DECIMAL(5,2) DEFAULT 0,
    carry_forward_days DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_emp_leave_year (employee_id, leave_type_id, leave_year),
    INDEX idx_employee (employee_id),
    INDEX idx_leave_year (leave_year),
    FOREIGN KEY (employee_id) REFERENCES users(id),   
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
);

-- ============================================================
-- LEAVE REQUESTS
-- The actual leave applications employees submit: which dates,
-- how many days, reason, optional supporting document, and the
-- overall status (Pending/Approved/Rejected/Cancelled). 
-- ============================================================
CREATE TABLE IF NOT EXISTS leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,   
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    leave_session ENUM(
        'Full Day',
        'First Half',
        'Second Half'
    ) DEFAULT 'Full Day',
    reason TEXT,
    document_path VARCHAR(255),
    emergency_contact VARCHAR(20),
    status ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Cancelled'
    ) DEFAULT 'Pending',
    current_stage INT DEFAULT 1,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id),      
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
);

-- ============================================================
-- LEAVE APPROVALS
-- The step-by-step approval trail for each leave request — one
-- row per approval stage (e.g. level 1 = ASM, level 2 = HR,
-- level 3 = Admin), recording who acted, what they decided, and
-- any remarks. 
-- ============================================================
CREATE TABLE IF NOT EXISTS leave_approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    leave_request_id INT NOT NULL,
    approval_level INT NOT NULL,
    approver_role ENUM(
        'ASM',
        'HR',
        'Admin'
    ) NOT NULL,
    approver_id INT UNSIGNED NOT NULL,   
    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',
    remarks TEXT,
    action_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id),
    FOREIGN KEY (approver_id) REFERENCES users(id),      
    INDEX idx_leave_request (leave_request_id),
    INDEX idx_status (status),
    INDEX idx_approver (approver_id)
);

-- ============================================================
-- HOLIDAY CALENDAR
-- Company/public/optional holidays, optionally scoped to a
-- branch. Used to exclude non-working days when calculating
-- total_days for a leave request, and to render the holiday
-- calendar on the frontend.
-- ============================================================
CREATE TABLE IF NOT EXISTS holiday_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    holiday_name VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_type ENUM(
        'Public',
        'Optional',
        'Company'
    ) NOT NULL,
    branch_id INT,   
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_holiday_date (holiday_date)
);

-- ============================================================
-- COMP-OFF REQUESTS
-- Requests for a compensatory day off in exchange for having
-- worked on an off-day/holiday (worked_date). Tracks the
-- requested comp_off_date, approval status, and an expiry_date
-- by which the comp-off must be used. Separate from leave_types/
-- leave_balances — this is its own standalone request+approval
-- flow, not a row inside leave_balances.
-- ============================================================
CREATE TABLE IF NOT EXISTS comp_off_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,   
    worked_date DATE NOT NULL,
    comp_off_date DATE,
    days DECIMAL(5,2) DEFAULT 1,
    reason TEXT,
    attachment_path VARCHAR(255),
    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',
    approved_by INT UNSIGNED,   
    approval_remarks TEXT,
    approved_at TIMESTAMP NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id),      
    FOREIGN KEY (approved_by) REFERENCES users(id),      
    INDEX idx_employee (employee_id)
);