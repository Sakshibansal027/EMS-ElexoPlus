USE employee_management_system;

ALTER TABLE leads ADD COLUMN region VARCHAR(100) NULL, ADD COLUMN next_follow_up_date DATE NULL;
