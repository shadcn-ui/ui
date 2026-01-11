# 🚀 SIMPLE DEPLOYMENT WITHOUT DOCKER

## The server can't download Docker images, so we'll use Node.js + PostgreSQL directly

---

## STEP 1: Connect to server via Termius
```
root@103.168.135.110
```

---

## STEP 2: Navigate to project folder
```bash
cd /opt/ocean-erp
```

---

## STEP 3: Install Node.js
```bash
# Extract the Node.js binary we transferred earlier
tar -xJf node-v20.19.6-linux-x64.tar.xz
mv node-v20.19.6-linux-x64 nodejs

# Add to PATH
export PATH=/opt/ocean-erp/nodejs/bin:$PATH

# Verify
node --version
npm --version
```

---

## STEP 4: Install PostgreSQL (using local .deb files)
```bash
# We need to download PostgreSQL packages on a machine with internet
# and transfer them to the server

# For now, let's check if PostgreSQL is already installed
which psql

# If not installed, we need to:
# 1. Download these on a computer with internet:
#    - postgresql-16
#    - postgresql-client-16
#    - postgresql-common
# 2. Transfer to server
# 3. Install with: dpkg -i *.deb
```

---

## ALTERNATIVE: Use SQLite (No PostgreSQL needed!)

Since the server has network issues, let's use SQLite instead:

```bash
cd /opt/ocean-erp

# Create environment file for SQLite
cat > .env.production << 'EOF'
# Database Configuration (SQLite)
DATABASE_URL=file:./ocean-erp.db

# NextAuth Configuration
NEXTAUTH_URL=http://103.168.135.110:4000
NODE_ENV=production
EOF

# Generate secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production

echo "✅ Environment created!"
cat .env.production
```

---

## STEP 5: Build the application on your Mac

**On your Mac terminal (not Termius), run:**

```bash
cd /Users/marfreax/Github/ocean-erp
source "$HOME/.nvm/nvm.sh"
nvm use 20
cd apps/v4
pnpm run build
```

This creates: `apps/v4/.next/standalone/`

---

## STEP 6: Transfer built files to server

**On your Mac:**

```bash
cd /Users/marfreax/Github/ocean-erp

# Package the built application
tar -czf ocean-erp-built.tar.gz \
  apps/v4/.next/standalone \
  apps/v4/.next/static \
  apps/v4/public

# Check size
ls -lh ocean-erp-built.tar.gz
```

**Now transfer via Termius SFTP:**
- Upload `ocean-erp-built.tar.gz` to `/opt/ocean-erp/`
- Upload `node-v20.19.6-linux-x64.tar.xz` to `/opt/ocean-erp/`

---

## STEP 7: Extract on server (in Termius)

```bash
cd /opt/ocean-erp

# Extract built app
tar -xzf ocean-erp-built.tar.gz

# Create folders
mkdir -p apps/v4/public/uploads/profiles
chmod -R 755 apps/v4/public/uploads

# Copy static files
cp -r apps/v4/.next/static apps/v4/.next/standalone/apps/v4/.next/
cp -r apps/v4/public apps/v4/.next/standalone/apps/v4/

echo "✅ Application extracted!"
```

---

## STEP 8: Install SQLite and dependencies

```bash
# Install sqlite3
apt-get install -y sqlite3

# Create database
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
('Umar', 'Admin', 'umar@oceanerp.com', '+62812345678', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1),
('Raymond', 'Sales', 'raymond@oceanerp.com', '+62812345679', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3);
EOFSQL

echo "✅ Database created!"
sqlite3 ocean-erp.db "SELECT email, first_name FROM users;"
```

---

## STEP 9: Start the application

```bash
cd /opt/ocean-erp/apps/v4/.next/standalone

# Set PATH
export PATH=/opt/ocean-erp/nodejs/bin:$PATH

# Start the app
PORT=4000 node apps/v4/server.js
```

---

## STEP 10: Setup as background service (optional)

Create systemd service:

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

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable ocean-erp
systemctl start ocean-erp
systemctl status ocean-erp
```

---

## STEP 11: Setup Nginx (optional)

```bash
apt-get install -y nginx

cat > /etc/nginx/sites-available/ocean-erp << 'EOF'
server {
    listen 80;
    server_name 103.168.135.110;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -s /etc/nginx/sites-available/ocean-erp /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## ✅ DONE!

Access: **http://103.168.135.110:4000** (direct) or **http://103.168.135.110** (via Nginx)

Login:
- Email: `umar@oceanerp.com`
- Password: `password`

---

## 📝 Summary

This deployment uses:
- ✅ Node.js (portable binary, no installation needed)
- ✅ SQLite (file-based database, no server needed)
- ✅ Built Next.js app (no build process on server)
- ✅ No internet connection required on server

All dependencies are transferred from your Mac!

