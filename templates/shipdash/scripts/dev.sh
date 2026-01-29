#!/bin/bash

# ShipDash Development Server
# Quick start for development

set -e

echo "Starting ShipDash development server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Start dev server
npm run dev
