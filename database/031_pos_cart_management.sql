-- POS Cart Management System (Hold/Retrieve Transactions)
-- Created: December 2025
-- Purpose: Allow cashiers to hold transactions and retrieve them later

-- Table: held_carts
-- Stores temporarily held shopping carts
CREATE TABLE IF NOT EXISTS held_carts (
    id SERIAL PRIMARY KEY,
    cart_reference VARCHAR(50) UNIQUE NOT NULL,
    session_id INTEGER REFERENCES pos_sessions(id),
    terminal_id INTEGER REFERENCES pos_terminals(id),
    cashier_id UUID REFERENCES users(id),
    customer_id INTEGER REFERENCES customers(id),
    cart_name VARCHAR(100),
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    grand_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'held' CHECK (status IN ('held', 'retrieved', 'cancelled', 'expired')),
    held_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retrieved_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: held_cart_items
-- Line items for held carts
CREATE TABLE IF NOT EXISTS held_cart_items (
    id SERIAL PRIMARY KEY,
    held_cart_id INTEGER NOT NULL REFERENCES held_carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    batch_id INTEGER REFERENCES product_batches(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_held_carts_reference ON held_carts(cart_reference);
CREATE INDEX IF NOT EXISTS idx_held_carts_session ON held_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_held_carts_terminal ON held_carts(terminal_id);
CREATE INDEX IF NOT EXISTS idx_held_carts_cashier ON held_carts(cashier_id);
CREATE INDEX IF NOT EXISTS idx_held_carts_status ON held_carts(status);
CREATE INDEX IF NOT EXISTS idx_held_carts_held_at ON held_carts(held_at);
CREATE INDEX IF NOT EXISTS idx_held_cart_items_cart ON held_cart_items(held_cart_id);
CREATE INDEX IF NOT EXISTS idx_held_cart_items_product ON held_cart_items(product_id);

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_held_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_held_carts_updated_at
    BEFORE UPDATE ON held_carts
    FOR EACH ROW
    EXECUTE FUNCTION update_held_carts_updated_at();

-- Function: Auto-expire old held carts (run daily)
-- Carts held for more than 24 hours will be marked as expired
CREATE OR REPLACE FUNCTION expire_old_held_carts()
RETURNS void AS $$
BEGIN
    UPDATE held_carts
    SET status = 'expired',
        expires_at = CURRENT_TIMESTAMP
    WHERE status = 'held'
    AND held_at < CURRENT_TIMESTAMP - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE held_carts IS 'Temporarily held POS transactions that can be retrieved later';
COMMENT ON TABLE held_cart_items IS 'Line items for held cart transactions';
COMMENT ON COLUMN held_carts.cart_reference IS 'Unique cart identifier for easy retrieval';
COMMENT ON COLUMN held_carts.cart_name IS 'Optional friendly name for the cart (e.g., "John Doe", "Table 5")';
COMMENT ON COLUMN held_carts.status IS 'held=currently on hold, retrieved=loaded back into POS, cancelled=discarded, expired=auto-expired after 24h';
