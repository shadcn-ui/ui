#!/bin/bash

# Quick deployment script for Ocean ERP
# Run this script on your server after cloning the repository

set -e

echo "🚀 Ocean ERP Quick Deployment Script"
echo "===================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Please run as root or with sudo"
    exit 1
fi

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose if not installed
if ! command -v docker compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    apt-get update
    apt-get install -y docker-compose-plugin
else
    echo "✅ Docker Compose already installed"
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚙️  Creating .env.production from example..."
    cp .env.production.example .env.production
    
    # Generate NEXTAUTH_SECRET
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    sed -i "s/generate_a_random_secret_key_here_minimum_32_characters/$NEXTAUTH_SECRET/" .env.production
    
    # Generate random DB password
    DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)
    sed -i "s/change_this_to_a_secure_password/$DB_PASSWORD/g" .env.production
    
    echo "✅ Environment file created with secure random passwords"
    echo "⚠️  Please review .env.production and update if needed"
else
    echo "✅ .env.production already exists"
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p apps/v4/public/uploads/profiles
mkdir -p init-db
mkdir -p ssl

# Set proper permissions
chmod 755 apps/v4/public/uploads
chmod 755 apps/v4/public/uploads/profiles

# Build and start containers
echo "🏗️  Building Docker containers..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Service Status:"
    docker compose ps
    echo ""
    echo "🌐 Application is now available at:"
    echo "   - HTTP: http://103.168.135.110"
    echo "   - Direct: http://103.168.135.110:4000"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Initialize the database (if not already done)"
    echo "   2. Access the application and login"
    echo "   3. Configure firewall rules"
    echo "   4. Set up SSL certificates (recommended)"
    echo ""
    echo "📚 For more information, see DEPLOYMENT_GUIDE.md"
else
    echo ""
    echo "❌ Deployment may have failed. Check logs:"
    echo "   docker compose logs"
    exit 1
fi
