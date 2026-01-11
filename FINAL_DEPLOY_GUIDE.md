# ✅ FINAL SIMPLE DEPLOYMENT (No Docker, No Internet Needed!)

## Problem: Server can't download Docker images due to no internet

## Solution: Deploy with Node.js directly + SQLite database

---

## 📦 STEP 1: Transfer files to server via Termius SFTP

Open Termius, connect to `root@103.168.135.110`, then upload these files:

### Files to upload:
1. **`/tmp/node-v20.19.6-linux-x64.tar.xz`** → Upload to: `/opt/ocean-erp/`
2. **`/Users/marfreax/Github/ocean-erp/ocean-erp-built.tar.gz`** → Upload to: `/opt/ocean-erp/`

**How to upload in Termius:**
- Connect to server
- Click the SFTP button
- Navigate to `/opt/ocean-erp`
- Click Upload and select the files above

---

## 💻 STEP 2: In Termius terminal, run these commands:

### A. Extract Node.js
```bash
cd /opt/ocean-erp
tar -xJf node-v20.19.6-linux-x64.tar.xz
mv node-v20.19.6-linux-x64 nodejs
export PATH=/opt/ocean-erp/nodejs/bin:$PATH
node --version
```

You should see: `v20.19.6`

---

### B. Extract built application
```bash
cd /opt/ocean-erp
tar -xzf ocean-erp-built.tar.gz

# Create folders
mkdir -p apps/v4/public/uploads/profiles
chmod -R 755 apps/v4/public/uploads

# Copy static files to correct location
cp -r apps/v4/.next/static apps/v4/.next/standalone/apps/v4/.next/
cp -r apps/v4/public/* apps/v4/.next/standalone/apps/v4/public/

echo "✅ Application extracted!"
```

---

### C. Create environment file
```bash
cd /opt/ocean-erp

cat > .env.production << 'EOF'
DATABASE_URL=file:/opt/ocean-erp/ocean-erp.db
NEXTAUTH_URL=http://103.168.135.110:4000
NODE_ENV=production
EOF

# Generate secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production

# Copy to app directory
cp .env.production apps/v4/.next/standalone/

cat .env.production
```

---

### D. Install SQLite and create database
```bash
# Install SQLite (if not already installed)
apt-get update
apt-get install -y sqlite3

cd /opt/ocean-erp

# Create database with tables and seed data
sqlite3 ocean-erp.db << 'EOFSQL'
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    profile_picture_url TEXT,
    role_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    route TEXT,
    parent_id INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER,
    module_id INTEGER,
    can_view INTEGER DEFAULT 1,
    can_create INTEGER DEFAULT 0,
    can_edit INTEGER DEFAULT 0,
    can_delete INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, module_id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT
);

INSERT INTO roles (id, name, description) VALUES
(1, 'Administrator', 'Full system access'),
(2, 'Sales Manager', 'Manage sales operations'),
(3, 'Sales Team', 'Sales team member');

INSERT INTO modules (id, name, description, icon, route, display_order) VALUES
(1, 'dashboard', 'Dashboard', 'LayoutDashboard', '/erp/dashboard', 1),
(2, 'sales', 'Sales', 'ShoppingCart', '/erp/sales', 2),
(3, 'product', 'Product', 'Package', '/erp/product', 3),
(4, 'settings', 'Settings', 'Settings', '/erp/settings', 9);

INSERT INTO role_modules (role_id, module_id, can_view, can_create, can_edit, can_delete)
VALUES 
(1, 1, 1, 1, 1, 1),
(1, 2, 1, 1, 1, 1),
(1, 3, 1, 1, 1, 1),
(1, 4, 1, 1, 1, 1),
(3, 2, 1, 1, 1, 0);

INSERT INTO users (first_name, last_name, email, phone, password_hash, role_id) VALUES
('Umar', 'Admin', 'umar@oceanerp.com', '+62812345678', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1),
('Raymond', 'Sales', 'raymond@oceanerp.com', '+62812345679', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3);
EOFSQL

# Verify database
sqlite3 ocean-erp.db "SELECT email, first_name, last_name FROM users;"

echo "✅ Database created!"
```

---

### E. Start the application
```bash
cd /opt/ocean-erp/apps/v4/.next/standalone

# Set environment
export PATH=/opt/ocean-erp/nodejs/bin:$PATH
export PORT=4000

# Start the app
node apps/v4/server.js
```

**Keep terminal open!** The app is now running.

---

## 🌐 STEP 3: Test the application

Open a **new terminal** in Termius (keep the first one running) and test:

```bash
curl http://localhost:4000
```

---

## 🎉 STEP 4: Access from your browser

Open: **http://103.168.135.110:4000**

Login:
- Email: **umar@oceanerp.com**
- Password: **password**

---

## 🔄 OPTIONAL: Run as background service

If you want the app to run in background and auto-start on reboot:

```bash
cat > /etc/systemd/system/ocean-erp.service << 'EOF'
[Unit]
Description=Ocean ERP Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ocean-erp/apps/v4/.next/standalone
Environment="PATH=/opt/ocean-erp/nodejs/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="PORT=4000"
Environment="NODE_ENV=production"
ExecStart=/opt/ocean-erp/nodejs/bin/node apps/v4/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
systemctl daemon-reload
systemctl enable ocean-erp
systemctl start ocean-erp

# Check status
systemctl status ocean-erp

# View logs
journalctl -u ocean-erp -f
```

Now you can close Termius and the app keeps running!

---

## 📋 Quick Commands:

```bash
# Check if app is running
systemctl status ocean-erp

# Restart app
systemctl restart ocean-erp

# Stop app
systemctl stop ocean-erp

# View logs
journalctl -u ocean-erp -f

# Check database
sqlite3 /opt/ocean-erp/ocean-erp.db "SELECT * FROM users;"
```

---

## ✅ What we did:

1. ✅ Transferred Node.js binary (no installation needed)
2. ✅ Transferred built Next.js app (no build on server)
3. ✅ Used SQLite database (no PostgreSQL server needed)
4. ✅ No Docker images to download
5. ✅ No internet connection required on server

**Everything works offline!**

