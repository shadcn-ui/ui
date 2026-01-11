#!/usr/bin/env bash
set -euo pipefail

# Wait for apt locks to be released
echo "Waiting for other package managers to finish..."

# Function to wait for apt locks
wait_for_apt() {
    local max_wait=300  # 5 minutes max
    local waited=0
    
    while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || \
          fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || \
          fuser /var/cache/apt/archives/lock >/dev/null 2>&1; do
        
        if [ $waited -ge $max_wait ]; then
            echo "Timeout waiting for package manager. Forcing cleanup..."
            # Kill any stuck apt processes
            killall apt-get 2>/dev/null || true
            killall dpkg 2>/dev/null || true
            sleep 2
            # Remove locks
            rm -f /var/lib/dpkg/lock-frontend 2>/dev/null || true
            rm -f /var/lib/apt/lists/lock 2>/dev/null || true
            rm -f /var/cache/apt/archives/lock 2>/dev/null || true
            dpkg --configure -a
            break
        fi
        
        echo -n "."
        sleep 2
        waited=$((waited + 2))
    done
    
    echo ""
    echo "Package manager ready!"
}

wait_for_apt

# Clean up any interrupted dpkg
dpkg --configure -a 2>/dev/null || true

echo "Ready to proceed with installation"
