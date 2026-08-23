CREATE TABLE attendance (

    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL,

    attendance_date DATE NOT NULL,

    check_in TIME,

    check_out TIME,

    status ENUM(
        'Present',
        'Absent',
        'Late',
        'Half Day',
        'Work From Home',
        'Leave',
        'Holiday',
        'Weekend'
    ) DEFAULT 'Present',

    working_hours DECIMAL(4,2) DEFAULT 0.00,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE (employee_id, attendance_date)

);