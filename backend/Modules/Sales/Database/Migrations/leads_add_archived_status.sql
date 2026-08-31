USE employee_management_system;

ALTER TABLE leads
    MODIFY COLUMN current_status ENUM(
        'New Lead',
        'Contacted',
        'Proposal Sent',
        'In Negotiation',
        'Closed',
        'Archived'
    ) NOT NULL DEFAULT 'New Lead';
