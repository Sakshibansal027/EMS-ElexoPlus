CREATE TABLE IF NOT EXISTS notifications (
    notification_id CHAR(36) PRIMARY KEY,

    user_id {{USER_ID_TYPE}} NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    type ENUM(
        'Success',
        'Warning',
        'Info',
        'Error'
    ) NOT NULL DEFAULT 'Info',

    category ENUM(
        'leave',
        'attendance',
        'sales',
        'employee',
        'payroll',
        'task',
        'system'
    ) NOT NULL DEFAULT 'system',

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    is_archived BOOLEAN NOT NULL DEFAULT FALSE,

    link VARCHAR(500) NULL,

    read_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users({{USER_PRIMARY_KEY}})
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_notification_user
    ON notifications(user_id);

CREATE INDEX idx_notification_user_read
    ON notifications(user_id, is_read);

CREATE INDEX idx_notification_created_at
    ON notifications(created_at);
