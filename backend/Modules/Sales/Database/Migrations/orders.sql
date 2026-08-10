CREATE TABLE orders (
    order_id CHAR(36) PRIMARY KEY,

    order_no VARCHAR(50) NOT NULL UNIQUE,

    client_id CHAR(36) NOT NULL,

    employee_id CHAR(36) NOT NULL,

    lead_id CHAR(36) NULL,

    territory_id CHAR(36) NULL,

    order_type ENUM(
        'B2B',
        'B2C'
    ) NOT NULL DEFAULT 'B2B',

    item_count INT NOT NULL DEFAULT 0,

    order_value DECIMAL(12,2) NOT NULL,

    order_status ENUM(
        'Pending',
        'Confirmed',
        'Packed',
        'Dispatched',
        'Delivered',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    payment_status ENUM(
        'Paid',
        'Pending'
    ) NOT NULL DEFAULT 'Pending',

    delivery_address TEXT NULL,

    order_date DATE NOT NULL,

    remarks TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

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
        ON UPDATE CASCADE,

    CONSTRAINT chk_order_item_count
        CHECK (item_count >= 0),

    CONSTRAINT chk_order_value
        CHECK (order_value >= 0)
);

CREATE INDEX idx_order_employee
    ON orders(employee_id);

CREATE INDEX idx_order_client
    ON orders(client_id);

CREATE INDEX idx_order_lead
    ON orders(lead_id);

CREATE INDEX idx_order_territory
    ON orders(territory_id);

CREATE INDEX idx_order_status
    ON orders(order_status);

CREATE INDEX idx_order_date
    ON orders(order_date);