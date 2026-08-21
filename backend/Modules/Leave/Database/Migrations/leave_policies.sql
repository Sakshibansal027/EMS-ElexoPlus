CREATE TABLE leave_policies (
    leave_policy_id CHAR(36) PRIMARY KEY,
 
    leave_policy_code VARCHAR(20) NOT NULL UNIQUE,
 
    leave_policy_name VARCHAR(100) NOT NULL UNIQUE,
 
    description TEXT NULL,
 
    annual_quota DECIMAL(5,2) NOT NULL,
 
    accrual_frequency ENUM(
        'Monthly',
        'Quarterly',
        'Yearly'
    ) NOT NULL,
 
    accrual_method ENUM(
        'Pro-rata',
        'Upfront'
    ) NOT NULL,
 
    allow_half_day BOOLEAN NOT NULL DEFAULT FALSE,
 
    requires_document BOOLEAN NOT NULL DEFAULT FALSE,
 
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
 
    carry_forward_allowed BOOLEAN NOT NULL DEFAULT FALSE,
 
    max_carry_forward_days DECIMAL(5,2) NOT NULL DEFAULT 0,
 
    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',
 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
 
    CONSTRAINT chk_leave_policy_carry_forward
        CHECK (
            carry_forward_allowed = TRUE
            OR max_carry_forward_days = 0
        )
);
 
CREATE INDEX idx_leave_policy_status
    ON leave_policies(status);