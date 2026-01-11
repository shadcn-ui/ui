#!/bin/bash

# Test connection to server before deployment
SERVER_IP="103.168.135.110"
SERVER_USER="root"

echo "🔍 Testing Connection to $SERVER_IP"
echo "===================================="
echo ""

# Test SSH connection
echo "1. Testing SSH connection..."
if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo '✅ SSH connection successful'" 2>/dev/null; then
    echo ""
else
    echo "❌ SSH connection failed"
    echo ""
    echo "Possible issues:"
    echo "  - Server is not reachable"
    echo "  - Wrong IP address"
    echo "  - Firewall blocking SSH"
    echo "  - SSH not configured"
    echo ""
    echo "Try connecting manually:"
    echo "  ssh $SERVER_USER@$SERVER_IP"
    exit 1
fi

# Test rsync availability
echo "2. Testing rsync on local machine..."
if command -v rsync &> /dev/null; then
    echo "✅ rsync is available"
    echo ""
else
    echo "❌ rsync not found"
    echo "Install with: brew install rsync"
    exit 1
fi

# Check server disk space
echo "3. Checking server disk space..."
DISK_SPACE=$(ssh $SERVER_USER@$SERVER_IP "df -h / | tail -1 | awk '{print \$4}'")
echo "✅ Available disk space: $DISK_SPACE"
echo ""

# Check if Docker is installed
echo "4. Checking Docker on server..."
if ssh $SERVER_USER@$SERVER_IP "command -v docker" &> /dev/null; then
    DOCKER_VERSION=$(ssh $SERVER_USER@$SERVER_IP "docker --version")
    echo "✅ Docker installed: $DOCKER_VERSION"
else
    echo "⚠️  Docker not installed (will be installed during deployment)"
fi
echo ""

# Check if deployment directory exists
echo "5. Checking deployment directory..."
if ssh $SERVER_USER@$SERVER_IP "[ -d /opt/ocean-erp ]"; then
    echo "⚠️  Deployment directory exists (/opt/ocean-erp)"
    echo "   Existing files will be overwritten"
else
    echo "✅ Deployment directory doesn't exist (will be created)"
fi
echo ""

# Test network from server
echo "6. Testing internet connection from server..."
if ssh $SERVER_USER@$SERVER_IP "ping -c 1 google.com" &> /dev/null; then
    echo "✅ Server has internet connection"
else
    echo "⚠️  Server may not have internet connection"
fi
echo ""

echo "======================================"
echo "✅ Pre-deployment checks passed!"
echo ""
echo "Ready to deploy. Run:"
echo "  ./deploy-manual.sh"
echo ""
