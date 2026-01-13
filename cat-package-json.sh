#!/usr/bin/env bash
set -e
# Script to display package.json from a .tgz file
# Usage: ./cat-package-json.sh <package.tgz>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <package.tgz>"
    exit 1
fi

TGZ_FILE="$HOME/projects/tgz-files-a98b169a-80dc-4f45-a13d-d167a627fe1d/$1"

if [ ! -f "$TGZ_FILE" ]; then
    echo "Error: File '$TGZ_FILE' not found"
    exit 1
fi

echo "Extracting package.json from $TGZ_FILE" >&2

# First, list the archive contents to find package.json
PACKAGE_JSON_PATH=$(tar -tzf "$TGZ_FILE" 2>/dev/null | grep -E "(^|/)package\.json$" | head -1)

if [ -z "$PACKAGE_JSON_PATH" ]; then
    echo "Error: package.json not found in archive" >&2
    echo "Archive contents:" >&2
    tar -tzf "$TGZ_FILE" 2>/dev/null | head -10 >&2
    exit 1
fi

# Extract and format with jq
# On macOS, -O must be combined: -xzfO or use -xzOf
tar -xzOf "$TGZ_FILE" "$PACKAGE_JSON_PATH" | jq
