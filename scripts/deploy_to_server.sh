#!/usr/bin/env bash
set -euo pipefail

# Complete deployment script for Ocean ERP
# This script will:
# 1. Install Docker and Docker Compose
# 2. Clone/sync the repository
# 3. Configure environment variables
# 4. Build and start the application
#
# Usage (run on server as root or with sudo):
#   curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/scripts/deploy_to_server.sh | sudo bash
#
# Or if files are already on server:
#   sudo bash /path/to/deploy_to_server.sh

DEPLOY_DIR="/opt/ocean-erp"
REPO_URL="${REPO_URL:-}"  # Set this if using git clone

echo "========================================="
echo "Ocean ERP Deployment Script"
echo "========================================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)" 
   exit 1
fi

# Step 1: Install Docker if not present
echo ""
echo "Step 1/5: Installing Docker..."
if command -v docker &> /dev/null; then
    echo "Docker already installed: $(docker --version)"
else
    echo "Installing Docker Engine..."
    
    # Wait for any apt locks to be released
    if [ -f "scripts/wait_for_apt.sh" ]; then
        bash scripts/wait_for_apt.sh
    else
        # Wait briefly for locks
        sleep 5
        while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
            echo "Waiting for other package managers..."
            sleep 2
        done
    fi
    
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release
    
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    systemctl enable --now docker
    echo "Docker installed successfully!"
fi

# Step 2: Prepare deployment directory
echo ""
echo "Step 2/5: Preparing deployment directory..."
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Step 3: Get application files
echo ""
echo "Step 3/5: Getting application files..."
if [ -n "$REPO_URL" ]; then
    echo "Cloning from repository: $REPO_URL"
    if [ -d ".git" ]; then
        git pull origin main
    else
        git clone "$REPO_URL" .
    fi
else
    echo "Repository URL not set. Files should be manually uploaded to $DEPLOY_DIR"
    echo "Checking if required files exist..."
    
    if [ ! -f "docker-compose.yml" ]; then
        echo "ERROR: docker-compose.yml not found in $DEPLOY_DIR"
        echo ""
        echo "Please either:"
        echo "1. Set REPO_URL and re-run: REPO_URL=https://github.com/your/repo.git sudo bash $0"
        echo "2. Manually upload files to $DEPLOY_DIR using SCP/SFTP"
        exit 1
    fi
fi

# Step 4: Configure environment
echo ""
echo "Step 4/5: Configuring environment..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env <<'EOF'
# Database Configuration
DB_USER=ocean_erp
DB_PASSWORD=CHANGE_ME_$(openssl rand -hex 16)
DB_NAME=ocean_erp

# NextAuth Configuration
NEXTAUTH_SECRET=CHANGE_ME_$(openssl rand -hex 32)
NEXTAUTH_URL=http://103.168.135.169:4000

# POS Configuration
POS_BASE_URL=http://103.168.135.169:4000

# Optional: POS Verification
# POS_EMAIL=admin@example.com
# POS_PASSWORD=password
EOF

    # Generate random passwords
    DB_PASS=$(openssl rand -hex 16)
    NEXTAUTH_SECRET=$(openssl rand -hex 32)
    
    sed -i "s/CHANGE_ME_[a-f0-9]*/DB_PASSWORD=$DB_PASS/g" .env
    sed -i "s/CHANGE_ME_[a-f0-9]*/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/g" .env
    
    echo ".env file created with random secrets"
    echo ""
    echo "IMPORTANT: Review and update .env file if needed:"
    echo "  - Update NEXTAUTH_URL if using a domain name"
    echo "  - Add POS_EMAIL and POS_PASSWORD for verification"
else
    echo ".env file already exists, skipping..."
fi

# Create necessary directories
mkdir -p apps/v4/public/uploads
mkdir -p ssl

# Step 5: Build and deploy
echo ""
echo "Step 5/5: Building and starting application..."

# Stop existing containers if any
if docker compose ps | grep -q "Up"; then
    echo "Stopping existing containers..."
    docker compose down
fi

# Build and start
echo "Building Docker images (this may take several minutes)..."
docker compose build

echo "Starting services..."
docker compose up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "========================================="
echo "Deployment Status:"
echo "========================================="
docker compose ps

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Access your application at:"
echo "  HTTP: http://103.168.135.110"
echo "  App:  http://103.168.135.110:4000"
echo ""
echo "Useful commands:"
echo "  View logs:        cd $DEPLOY_DIR && docker compose logs -f"
echo "  Restart services: cd $DEPLOY_DIR && docker compose restart"
echo "  Stop services:    cd $DEPLOY_DIR && docker compose down"
echo "  View status:      cd $DEPLOY_DIR && docker compose ps"
echo ""
echo "Configuration files:"
echo "  Environment: $DEPLOY_DIR/.env"
echo "  Compose:     $DEPLOY_DIR/docker-compose.yml"
echo ""
