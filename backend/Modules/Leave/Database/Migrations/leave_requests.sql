CREATE TABLE leave_requests (
    leave_request_id CHAR(36) PRIMARY KEY,
 
    employee_id CHAR(36) NOT NULL,
 
    leave_policy_id CHAR(36) NOT NULL,
 
    start_date DATE NOT NULL,
 
    end_date DATE NOT NULL,
 
    day_type ENUM(
        'Full Day',
        'First Half',
        'Second Half'
    ) NOT NULL DEFAULT 'Full Day',
 
    reason TEXT NOT NULL,
 
    emergency_contact VARCHAR(20) NULL,
 
    status ENUM(
        'Pending',
        'Under Review',
        'Approved',
        'Rejected',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',
 
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
 
    CONSTRAINT fk_leave_request_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
 
    CONSTRAINT fk_leave_request_policy
        FOREIGN KEY (leave_policy_id)
        REFERENCES leave_policies(leave_policy_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
 
    CONSTRAINT chk_leave_request_dates
        CHECK (end_date >= start_date)
);
 
CREATE INDEX idx_leave_request_employee
    ON leave_requests(employee_id);
 
CREATE INDEX idx_leave_request_status
    ON leave_requests(status);
 
CREATE INDEX idx_leave_request_policy
    ON leave_requests(leave_policy_id);
 
CREATE INDEX idx_leave_request_dates
    ON leave_requests(start_date, end_date);