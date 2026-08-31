USE employee_management_system;

CREATE TABLE sales_activity_logs (
    activity_id CHAR(36) PRIMARY KEY,
    lead_id CHAR(36) NOT NULL,
    activity_type ENUM('Call','Meeting','Email','Note','System') NOT NULL DEFAULT 'Note',
    note TEXT NOT NULL,
    created_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_activity_lead FOREIGN KEY (lead_id) REFERENCES leads(lead_id) ON DELETE CASCADE,
    CONSTRAINT fk_sales_activity_employee FOREIGN KEY (created_by) REFERENCES employees(employee_id) ON DELETE RESTRICT
);

CREATE INDEX idx_sales_activity_lead ON sales_activity_logs(lead_id, created_at);
