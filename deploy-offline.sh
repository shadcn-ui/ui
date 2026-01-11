#!/bin/bash

# Ocean ERP - Complete Offline Deployment Script
# This script deploys the application without requiring internet on the server

set -e

SERVER="103.168.135.110"
SERVER_USER="root"
SERVER_PATH="/opt/ocean-erp"

echo "=========================================="
echo "Ocean ERP Offline Deployment"
echo "=========================================="
echo ""

# Step 1: Transfer Node.js binary
echo "Step 1: Transferring Node.js binary..."
rsync -avz --progress /tmp/node-v20.19.6-linux-x64.tar.xz ${SERVER_USER}@${SERVER}:${SERVER_PATH}/

# Step 2: Transfer built application
echo "Step 2: Transferring built application..."
cd /Users/marfreax/Github/ocean-erp
rsync -avz --progress apps/v4/.next/standalone/ ${SERVER_USER}@${SERVER}:${SERVER_PATH}/standalone/
rsync -avz --progress apps/v4/.next/static ${SERVER_USER}@${SERVER}:${SERVER_PATH}/standalone/apps/v4/.next/
rsync -avz --progress apps/v4/public ${SERVER_USER}@${SERVER}:${SERVER_PATH}/standalone/apps/v4/

# Step 3: Setup on server
echo "Step 3: Setting up on server..."
ssh ${SERVER_USER}@${SERVER} << 'ENDSSH'
set -e
cd /opt/ocean-erp

# Extract Node.js
echo "Extracting Node.js..."
tar -xJf node-v20.19.6-linux-x64.tar.xz
mv node-v20.19.6-linux-x64 nodejs
export PATH=/opt/ocean-erp/nodejs/bin:$PATH

# Verify Node.js
echo "Node.js version:"
node --version
npm --version

# Create .env.production
echo "Creating environment file..."
cat > standalone/.env.production << 'EOF'
# Database Configuration
DB_USER=ocean_erp
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ocean_erp

# Database URL
DATABASE_URL=postgresql://ocean_erp:${DB_PASSWORD}@localhost:5432/ocean_erp

# NextAuth Configuration
NEXTAUTH_URL=http://103.168.135.110:4000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=production
EOF

# Replace password placeholders
DB_PASS=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)
AUTH_SECRET=$(openssl rand -base64 32)
sed -i "s/\$(openssl rand -base64 16 | tr -d \"=+\/\" | cut -c1-20)/$DB_PASS/g" standalone/.env.production
sed -i "s/\$(openssl rand -base64 32)/$AUTH_SECRET/g" standalone/.env.production
sed -i "s/\${DB_PASSWORD}/$DB_PASS/g" standalone/.env.production

# Create uploads directory
mkdir -p standalone/apps/v4/public/uploads/profiles
chmod -R 755 standalone/apps/v4/public/uploads

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Install and configure PostgreSQL on the server"
echo "2. Run the database migrations"
echo "3. Start the application:"
echo "   cd /opt/ocean-erp/standalone"
echo "   /opt/ocean-erp/nodejs/bin/node apps/v4/server.js"
echo ""
echo "Or create a systemd service to run it automatically."
echo ""

ENDSSH

echo ""
echo "=========================================="
echo "Deployment package transferred successfully!"
echo "=========================================="
echo ""
echo "To complete the deployment:"
echo "1. SSH to the server: ssh root@103.168.135.110"
echo "2. Install PostgreSQL (you may need to enable internet temporarily or transfer .deb files)"
echo "3. Start the application as shown above"
echo ""
