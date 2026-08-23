CREATE TABLE company_holidays (
    holiday_id CHAR(36) PRIMARY KEY,
 
    title VARCHAR(150) NOT NULL,
 
    holiday_date DATE NOT NULL,
 
    holiday_type ENUM(
        'Public Holiday',
        'Optional Holiday',
        'Company Holiday'
    ) NOT NULL,
 
    location VARCHAR(100) NOT NULL DEFAULT 'All',
 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
 
    CONSTRAINT uq_company_holiday
        UNIQUE (holiday_date, title, location)
);
 
CREATE INDEX idx_company_holiday_date
    ON company_holidays(holiday_date);
 
CREATE INDEX idx_company_holiday_location
    ON company_holidays(location);
 
CREATE INDEX idx_company_holiday_type
    ON company_holidays(holiday_type);
 