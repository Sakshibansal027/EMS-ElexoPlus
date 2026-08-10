CREATE TABLE notifications (
    notification_id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    type ENUM(
        'Success',
        'Warning',
        'Info',
        'Error'
    ) NOT NULL DEFAULT 'Info',

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    read_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_notification_user
    ON notifications(user_id);

CREATE INDEX idx_notification_user_read
    ON notifications(user_id, is_read);

CREATE INDEX idx_notification_created_at
    ON notifications(created_at);