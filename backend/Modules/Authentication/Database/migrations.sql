-- ============================================================
-- ElexoPlus EMS - Authentication Module Migrations
-- Derived from the frontend auth module analysis
--   - Login (email / password / username)
--   - Role-based access (ADMIN, HR, ASM, SALES_EXECUTIVE)
--   - User session / profile storage
--   - Password reset (forgot password)
-- ============================================================

-- ------------------------------------------------------------
-- users  — System login accounts
-- Fields map to frontend auth mock users (mockUsers.js):
--   id, username, password, role, name, email, designation,
--   avatar, status
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    username        VARCHAR(50)      NOT NULL,
    email           VARCHAR(100)     NOT NULL,
    password        VARCHAR(255)     NOT NULL,
    name            VARCHAR(100)     NOT NULL,
    designation     VARCHAR(100)     NULL,
    avatar          VARCHAR(255)     NULL,
    role            ENUM('ADMIN','HR','ASM','SALES_EXECUTIVE') NOT NULL DEFAULT 'SALES_EXECUTIVE',
    status          VARCHAR(50)      NULL,
    last_login_at   DATETIME         NULL,
    created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role (role)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- password_resets  —  Forgot-password reset tokens
-- Used by the auth "Forgot Password" flow to store the one-time
-- reset token issued for a user's email.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_resets (
    id          INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED        NOT NULL,
    token       VARCHAR(255)        NOT NULL,
    expires_at  DATETIME            NOT NULL,
    used_at     DATETIME            NULL,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_password_resets_token (token),
    KEY idx_password_resets_user (user_id),
    CONSTRAINT fk_password_resets_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;