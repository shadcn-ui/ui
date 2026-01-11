# 🚀 SIMPLE DEPLOYMENT - COPY & PASTE IN TERMIUS

## Open Termius, connect to: root@103.168.135.110

Then copy and paste these commands one section at a time:

---

## STEP 1: Go to project folder
```bash
cd /opt/ocean-erp
```

---

## STEP 2: Create environment file (copy ALL of this)
```bash
cat > .env.production << 'EOF'
DB_USER=ocean_erp
DB_PASSWORD=OceanERP2024Secure
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ocean_erp
DATABASE_URL=postgresql://ocean_erp:OceanERP2024Secure@postgres:5432/ocean_erp
NEXTAUTH_URL=http://103.168.135.110
NODE_ENV=production
EOF

# Generate secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production

echo "✅ Environment file created!"
cat .env.production
```

---

## STEP 3: Create folders
```bash
mkdir -p apps/v4/public/uploads/profiles
mkdir -p init-db
chmod -R 755 apps/v4/public/uploads
echo "✅ Folders created!"
```

---

## STEP 4: Create database init file (copy ALL of this)
```bash
cat > init-db/00-init.sql << 'EOFDB'
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    profile_picture_url TEXT,
    role_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    route VARCHAR(255),
    parent_id INTEGER REFERENCES modules(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_modules table
CREATE TABLE IF NOT EXISTS role_modules (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT true,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, module_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Insert roles
INSERT INTO roles (id, name, description) VALUES
(1, 'Administrator', 'Full system access'),
(2, 'Sales Manager', 'Manage sales operations'),
(3, 'Sales Team', 'Sales team member'),
(4, 'Product Manager', 'Manage products and inventory'),
(5, 'Finance Manager', 'Manage accounting and finance')
ON CONFLICT (id) DO NOTHING;

-- Insert modules
INSERT INTO modules (id, name, description, icon, route, parent_id, display_order, is_active) VALUES
(1, 'dashboard', 'Dashboard', 'LayoutDashboard', '/erp/dashboard', NULL, 1, true),
(2, 'sales', 'Sales', 'ShoppingCart', '/erp/sales', NULL, 2, true),
(3, 'product', 'Product', 'Package', '/erp/product', NULL, 3, true),
(4, 'operations', 'Operations', 'Factory', '/erp/operations', NULL, 4, true),
(5, 'accounting', 'Accounting', 'Calculator', '/erp/accounting', NULL, 5, true),
(6, 'hris', 'HRIS', 'Users', '/erp/hris', NULL, 6, true),
(7, 'analytics', 'Analytics', 'BarChart3', '/erp/analytics', NULL, 7, true),
(8, 'reports', 'Reports', 'FileText', '/erp/reports', NULL, 8, true),
(9, 'settings', 'Settings', 'Settings', '/erp/settings', NULL, 9, true)
ON CONFLICT (id) DO NOTHING;

-- Assign all modules to Administrator role
INSERT INTO role_modules (role_id, module_id, can_view, can_create, can_edit, can_delete)
SELECT 1, id, true, true, true, true FROM modules
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Assign sales module to Sales Team role
INSERT INTO role_modules (role_id, module_id, can_view, can_create, can_edit, can_delete)
VALUES (3, 2, true, true, true, false)
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Insert demo users (password is 'password' for all - hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, phone, password_hash, role_id) VALUES
('Umar', 'Admin', 'umar@oceanerp.com', '+62812345678', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1),
('Raymond', 'Sales', 'raymond@oceanerp.com', '+62812345679', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3)
ON CONFLICT (email) DO NOTHING;

EOFDB

echo "✅ Database init file created!"
ls -lh init-db/
```

---

## STEP 5: Start Docker containers (this takes 5-10 minutes first time)
```bash
docker compose up -d

echo ""
echo "🚀 Starting containers... Please wait 2 minutes..."
sleep 120

# Check status
docker compose ps
```

---

## STEP 6: Watch the logs
```bash
docker compose logs -f
```

**Press Ctrl+C when you see "Ready" or "Listening on port 4000"**

---

## STEP 7: Test the application
```bash
# Test from server
curl -I http://localhost

# Check database
docker compose exec postgres psql -U ocean_erp -d ocean_erp -c "SELECT email, first_name, last_name FROM users;"
```

---

## ✅ DONE! Open browser:

**http://103.168.135.110**

Login with:
- Email: `umar@oceanerp.com`
- Password: `password`

---

## 📝 Important Notes:

1. **First startup takes 5-10 minutes** - Docker needs to download base images
2. **Database auto-initializes** - from the 00-init.sql file we created
3. **If something fails** - run: `docker compose logs -f` to see errors

## 🔧 Quick Commands:

```bash
# View logs
docker compose logs -f app

# Restart application
docker compose restart app

# Stop everything
docker compose down

# Start fresh (removes data!)
docker compose down -v
docker compose up -d
```

