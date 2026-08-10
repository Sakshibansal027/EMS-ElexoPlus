
CREATE TABLE password_resets (
    password_reset_id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    token_hash VARCHAR(255) NOT NULL UNIQUE,

    expires_at DATETIME NOT NULL,

    used_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_password_reset_user
    ON password_resets(user_id);

CREATE INDEX idx_password_reset_expires
    ON password_resets(expires_at);