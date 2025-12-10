#!/usr/bin/env bash
set -euo pipefail

# Simple migration runner for local dev
# Requires: PGPASSWORD, PGHOST, PGUSER, PGDATABASE or DATABASE_URL in env

MIGRATIONS_DIR="$(dirname "$0")/../db/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Migrations directory not found: $MIGRATIONS_DIR"
  exit 1
fi

echo "Running migrations from $MIGRATIONS_DIR"
for f in "$MIGRATIONS_DIR"/*.sql; do
  echo "- Applying: $f"
  psql "$DATABASE_URL" -f "$f"
done

echo "Migrations complete"
