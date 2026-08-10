CREATE TABLE leave_types (
    leave_type_id CHAR(36) PRIMARY KEY,

    leave_type_code VARCHAR(20) NOT NULL UNIQUE,

    leave_type_name VARCHAR(100) NOT NULL UNIQUE,

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

    carry_forward_allowed BOOLEAN NOT NULL DEFAULT FALSE,

    max_carry_forward_days DECIMAL(5,2) NOT NULL DEFAULT 0,

    is_paid BOOLEAN NOT NULL DEFAULT TRUE,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_leave_type_carry_forward
        CHECK (
            carry_forward_allowed = TRUE
            OR max_carry_forward_days = 0
        )
);

CREATE INDEX idx_leave_type_status
    ON leave_types(status);