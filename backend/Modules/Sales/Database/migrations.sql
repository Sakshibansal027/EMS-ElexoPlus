-- ============================================================
-- Sales Module - Database Migration
-- ============================================================
-- IMPORTANT: This script assumes the `employees` table already
-- exists (created by the Authentication/HR module). Every
-- employee_id foreign key below depends on it. Run the HR
-- module's migrations BEFORE this file.
--
-- Execution order matters because of foreign key dependencies.
-- Tables are created in the following order:
--   1. territories              (no dependencies)
--   2. target_types             (no dependencies)
--   3. territory_assignments    (needs territories, employees)
--   4. targets                  (needs employees, target_types)
--   5. leads                    (needs employees)
--   6. clients                  (needs leads, employees)
--   7. client_visits            (needs employees, clients)
--   8. lead_status_history      (needs leads, employees)
--   9. attendance               (needs employees)
--  10. expenses                 (needs employees)
--  11. daily_activity_reports   (needs employees)
--  12. orders                   (needs clients, employees, leads, territories)
-- ============================================================

USE employee_management_system;


-- ============================================================
-- 1. TERRITORIES
-- Geographic sales zones (e.g. "Delhi West", "Noida Sector 62")
-- that an ASM divides the market into.
-- ============================================================
CREATE TABLE territories (

    territory_id    CHAR(36)      PRIMARY KEY,
    territory_name  VARCHAR(100)  NOT NULL UNIQUE,
    description     TEXT,
    status          ENUM('Active', 'Inactive')  NOT NULL DEFAULT 'Active',

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);


-- ============================================================
-- 2. TARGET TYPES
-- Lookup table for categories of sales targets
-- (e.g. "Sales Volume", "New Client Acquisition").
-- ============================================================
CREATE TABLE target_types (

    target_type_id    CHAR(36)      PRIMARY KEY,
    target_type_name  VARCHAR(100)  NOT NULL UNIQUE,
    description        TEXT,
    status              ENUM('Active', 'Inactive')  NOT NULL DEFAULT 'Active',

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);


-- ============================================================
-- 3. TERRITORY ASSIGNMENTS
-- Which employee (SE) is assigned to which territory, by whom
-- (ASM), and for what period.
-- ============================================================
CREATE TABLE territory_assignments (

    assignment_id             CHAR(36)  PRIMARY KEY,
    territory_id               CHAR(36)  NOT NULL,
    assigned_to_employee_id    CHAR(36)  NOT NULL,
    assigned_by_employee_id    CHAR(36)  NOT NULL,

    assigned_date    DATE  NOT NULL DEFAULT (CURRENT_DATE),
    effective_from    DATE  NOT NULL,
    effective_to      DATE  NULL,

    status     ENUM('Active', 'Inactive', 'Completed')  NOT NULL DEFAULT 'Active',
    remarks    TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignment_territory
        FOREIGN KEY (territory_id)
        REFERENCES territories(territory_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_assignment_employee
        FOREIGN KEY (assigned_to_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_assignment_assigned_by
        FOREIGN KEY (assigned_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE

);

CREATE INDEX idx_assignment_territory ON territory_assignments(territory_id);
CREATE INDEX idx_assignment_employee  ON territory_assignments(assigned_to_employee_id);
CREATE INDEX idx_assignment_status    ON territory_assignments(status);


-- ============================================================
-- 4. TARGETS
-- Individual or team sales targets, with progress tracking
-- (target_value vs achieved_value).
-- ============================================================
CREATE TABLE targets (

    target_id                 CHAR(36)  PRIMARY KEY,
    assigned_by_employee_id    CHAR(36)  NOT NULL,
    assigned_to_employee_id    CHAR(36)  NOT NULL,
    assignment_type             ENUM('Individual', 'Team')  NOT NULL,
    target_type_id              CHAR(36)  NOT NULL,

    target_period       ENUM('Monthly', 'Quarterly')  NOT NULL,
    target_title         VARCHAR(255)  NOT NULL,
    target_description    TEXT,
    target_value           DECIMAL(12, 2)  NOT NULL,
    achieved_value          DECIMAL(12, 2)  DEFAULT 0.00,

    start_date    DATE  NOT NULL,
    end_date       DATE  NOT NULL,

    status     ENUM('Pending', 'Active', 'Completed', 'Cancelled')  NOT NULL DEFAULT 'Pending',
    remarks    TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_target_assigned_by
        FOREIGN KEY (assigned_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_target_assigned_to
        FOREIGN KEY (assigned_to_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_target_type
        FOREIGN KEY (target_type_id)
        REFERENCES target_types(target_type_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE

);

CREATE INDEX idx_target_employee ON targets(assigned_to_employee_id);
CREATE INDEX idx_target_type     ON targets(target_type_id);
CREATE INDEX idx_target_status   ON targets(status);


-- ============================================================
-- 5. LEADS
-- Potential customers that a sales executive is pursuing,
-- before they convert into an actual client.
-- ============================================================
CREATE TABLE leads (

    lead_id         CHAR(36)      PRIMARY KEY,
    employee_id      CHAR(36)      NOT NULL,
    lead_name         VARCHAR(255)  NOT NULL,
    phone_number       VARCHAR(15)   NOT NULL UNIQUE,
    email                VARCHAR(255),
    company_name          VARCHAR(255),

    lead_source    ENUM('Reference', 'Website', 'Social Media', 'Walk-In', 'Cold Calling', 'Other')  NOT NULL,
    lead_priority   ENUM('Low', 'Medium', 'High')  NOT NULL DEFAULT 'Medium',
    current_status   ENUM('New', 'Contacted', 'Qualified', 'Converted', 'Lost')  NOT NULL DEFAULT 'New',

    expected_value    DECIMAL(12, 2),
    remarks             TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lead_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE

);

CREATE INDEX idx_lead_employee ON leads(employee_id);
CREATE INDEX idx_lead_status   ON leads(current_status);
CREATE INDEX idx_lead_source   ON leads(lead_source);


-- ============================================================
-- 6. CLIENTS
-- Converted / existing customers. May optionally trace back to
-- the lead they originated from.
-- ============================================================
CREATE TABLE clients (

    client_id     CHAR(36)  PRIMARY KEY,
    lead_id        CHAR(36)  NULL,

    client_name       VARCHAR(255)  NOT NULL,
    contact_person      VARCHAR(255),
    phone_number          VARCHAR(15)   NOT NULL UNIQUE,
    email                    VARCHAR(255),
    address                    TEXT,
    city                         VARCHAR(100),
    state                          VARCHAR(100),
    pincode                          VARCHAR(20),

    status                  ENUM('Active', 'Inactive')  NOT NULL DEFAULT 'Active',
    assigned_employee_id     CHAR(36)  NULL,
    remarks                    TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_client_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_client_employee
        FOREIGN KEY (assigned_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

);

CREATE INDEX idx_client_employee ON clients(assigned_employee_id);


-- ============================================================
-- 7. CLIENT VISITS
-- Field visits made by a sales executive to a client -
-- purpose, discussion, outcome, next follow-up.
-- ============================================================
CREATE TABLE client_visits (

    visit_id        CHAR(36)  PRIMARY KEY,
    employee_id       CHAR(36)  NOT NULL,
    client_id           CHAR(36)  NOT NULL,

    visit_date    DATE          NOT NULL,
    purpose        VARCHAR(255)  NOT NULL,

    discussion_summary    TEXT,
    outcome                  TEXT,
    next_followup_date        DATE,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_visit_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_visit_client
        FOREIGN KEY (client_id)
        REFERENCES clients(client_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE

);

CREATE INDEX idx_visit_employee ON client_visits(employee_id);
CREATE INDEX idx_visit_client   ON client_visits(client_id);
CREATE INDEX idx_visit_date     ON client_visits(visit_date);


-- ============================================================
-- 8. LEAD STATUS HISTORY
-- Audit trail of every status change a lead goes through.
-- Append-only log - rows here are never updated, only inserted.
-- ============================================================
CREATE TABLE lead_status_history (

    status_history_id     CHAR(36)  PRIMARY KEY,
    lead_id                  CHAR(36)  NOT NULL,

    old_status    ENUM('New', 'Contacted', 'Qualified', 'Converted', 'Lost')  NOT NULL,
    new_status     ENUM('New', 'Contacted', 'Qualified', 'Converted', 'Lost')  NOT NULL,

    changed_by_employee_id    CHAR(36)  NOT NULL,
    remarks                      TEXT,
    changed_at                     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_history_employee
        FOREIGN KEY (changed_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE

);


-- ============================================================
-- 9. ATTENDANCE
-- Daily check-in / check-out record for each employee.
-- One row per employee per day (enforced by unique constraint).
-- ============================================================
CREATE TABLE attendance (

    attendance_id     CHAR(36)  PRIMARY KEY,
    employee_id          CHAR(36)  NOT NULL,

    attendance_date    DATE  NOT NULL,
    check_in_time        TIME  NULL,
    check_out_time         TIME  NULL,

    status     ENUM('Present', 'Absent', 'Half Day', 'Leave')  NOT NULL,
    remarks    TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT uk_employee_attendance
        UNIQUE (employee_id, attendance_date)

);


-- ============================================================
-- 10. EXPENSES
-- Travel / food / misc expense claims submitted by a sales
-- executive, approved or rejected by an ASM.
-- ============================================================
CREATE TABLE expenses (

    expense_id       CHAR(36)  PRIMARY KEY,
    employee_id         CHAR(36)  NOT NULL,

    expense_date        DATE            NOT NULL,
    expense_category      ENUM('Travel', 'Food', 'Miscellaneous')  NOT NULL,
    amount                   DECIMAL(10, 2)  NOT NULL,
    description                TEXT,
    receipt_url                  VARCHAR(500),

    approval_status             ENUM('Pending', 'Approved', 'Rejected')  NOT NULL DEFAULT 'Pending',
    approved_by_employee_id       CHAR(36)   NULL,
    approved_at                      DATETIME  NULL,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_expense_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_expense_approved_by
        FOREIGN KEY (approved_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

);

CREATE INDEX idx_expense_employee ON expenses(employee_id);
CREATE INDEX idx_expense_date     ON expenses(expense_date);
CREATE INDEX idx_expense_status   ON expenses(approval_status);


-- ============================================================
-- 11. DAILY ACTIVITY REPORTS
-- End-of-day summary a sales executive submits - visits done,
-- leads generated, plan for tomorrow. Reviewed by an ASM.
-- ============================================================
CREATE TABLE daily_activity_reports (

    report_id       CHAR(36)  PRIMARY KEY,
    employee_id        CHAR(36)  NOT NULL,

    report_date              DATE  NOT NULL,
    total_client_visits         INT   NOT NULL DEFAULT 0,
    total_leads_generated          INT   NOT NULL DEFAULT 0,
    total_followups                   INT   NOT NULL DEFAULT 0,

    activity_summary      TEXT  NOT NULL,
    challenges_faced         TEXT,
    plan_for_next_day           TEXT,

    review_status               ENUM('Pending', 'Reviewed')  NOT NULL DEFAULT 'Pending',
    reviewed_by_employee_id       CHAR(36)   NULL,
    reviewed_at                      DATETIME  NULL,
    asm_feedback                        TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_daily_report_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_daily_report_reviewer
        FOREIGN KEY (reviewed_by_employee_id)
        REFERENCES employees(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT uk_employee_report_date
        UNIQUE (employee_id, report_date)

);

CREATE INDEX idx_report_review_status ON daily_activity_reports(review_status);
CREATE INDEX idx_report_reviewer      ON daily_activity_reports(reviewed_by_employee_id);
CREATE INDEX idx_report_date          ON daily_activity_reports(report_date);


-- ============================================================
-- 12. ORDERS
-- Confirmed purchase orders placed by a client, tracked from
-- placement through delivery.
-- ============================================================
CREATE TABLE orders (

    order_id       CHAR(36)      PRIMARY KEY,
    order_no          VARCHAR(50)   NOT NULL UNIQUE,
    client_id            CHAR(36)      NOT NULL,
    employee_id             CHAR(36)      NOT NULL,
    lead_id                    CHAR(36)      NULL,
    territory_id                   CHAR(36)      NULL,

    order_type       ENUM('B2B', 'B2C')  NOT NULL DEFAULT 'B2B',
    item_count          INT  NOT NULL DEFAULT 0,
    order_value             DECIMAL(12, 2)  NOT NULL,

    order_status      ENUM('Pending', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled')  NOT NULL DEFAULT 'Pending',
    payment_status       ENUM('Paid', 'Pending')  NOT NULL DEFAULT 'Pending',

    delivery_address    TEXT,
    order_date              DATE  NOT NULL,
    remarks                    TEXT,

    created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_client
        FOREIGN KEY (client_id)
        REFERENCES clients(client_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_territory
        FOREIGN KEY (territory_id)
        REFERENCES territories(territory_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

);

CREATE INDEX idx_order_employee ON orders(employee_id);
CREATE INDEX idx_order_client   ON orders(client_id);
CREATE INDEX idx_order_status   ON orders(order_status);