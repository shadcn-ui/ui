#!/usr/bin/env bash
set -euo pipefail

# Fix Docker network and DNS issues
# Run on server: sudo bash scripts/fix_network.sh

echo "🔧 Fixing Docker Network & DNS Issues"
echo "======================================"
echo ""

# Fix DNS resolution
echo "1️⃣  Configuring DNS..."

# Add Google and Cloudflare DNS
cat > /etc/resolv.conf <<EOF
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 1.1.1.1
EOF

# Make it immutable temporarily
chattr +i /etc/resolv.conf 2>/dev/null || true

echo "✅ DNS configured"
echo ""

# Configure Docker daemon with DNS and mirrors
echo "2️⃣  Configuring Docker daemon..."

mkdir -p /etc/docker

cat > /etc/docker/daemon.json <<'EOF'
{
  "dns": ["8.8.8.8", "8.8.4.4", "1.1.1.1"],
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 3
}
EOF

echo "✅ Docker daemon configured"
echo ""

# Restart Docker
echo "3️⃣  Restarting Docker..."
systemctl restart docker
sleep 3
echo "✅ Docker restarted"
echo ""

# Test connectivity
echo "4️⃣  Testing connectivity..."

if ping -c 2 8.8.8.8 > /dev/null 2>&1; then
    echo "✅ Internet connectivity OK"
else
    echo "❌ No internet connectivity - check firewall/network"
fi

if ping -c 2 registry-1.docker.io > /dev/null 2>&1; then
    echo "✅ Can reach Docker Hub"
else
    echo "⚠️  Cannot reach Docker Hub - will try mirrors"
fi

echo ""
echo "======================================"
echo "✅ Network Fix Complete!"
echo "======================================"
echo ""
echo "Now run: sudo bash scripts/fix_deployment.sh"
echo ""
