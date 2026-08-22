CREATE TABLE user_preferences (
    user_preference_id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL UNIQUE,

    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,

    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,

    in_app_notifications BOOLEAN NOT NULL DEFAULT TRUE,

    weekly_digest BOOLEAN NOT NULL DEFAULT FALSE,

    quiet_hours BOOLEAN NOT NULL DEFAULT FALSE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_user_preferences_user
    ON user_preferences(user_id);