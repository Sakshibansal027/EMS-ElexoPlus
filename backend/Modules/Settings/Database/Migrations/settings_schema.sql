-- Settings module schema enhancements.
-- All statements are idempotent (IF NOT EXISTS / safe ALTER).

-- 1. Add 'color' column to employee_statuses for status badge color.
ALTER TABLE employee_statuses
    ADD COLUMN IF NOT EXISTS color VARCHAR(20) NULL DEFAULT '#2ecc71';

-- 2. Expand user_preferences to hold full preference JSON.
ALTER TABLE user_preferences
    ADD COLUMN IF NOT EXISTS appearance JSON NULL,
    ADD COLUMN IF NOT EXISTS notification_settings JSON NULL,
    ADD COLUMN IF NOT EXISTS language_settings JSON NULL;

-- 3. Add 'department_id' to the existing 'designations' table (used by Employee module)
--    so designations can be linked to departments.
ALTER TABLE designations
    ADD COLUMN IF NOT EXISTS department_id CHAR(36) NULL;

-- 4. Add 'head' VARCHAR column to departments for display name of department head.
--    The existing head_employee_id FK is kept for referential integrity.
ALTER TABLE departments
    ADD COLUMN IF NOT EXISTS head VARCHAR(150) NULL;
