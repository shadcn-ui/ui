# Database Setup Guide for Ocean ERP

## Problem
The application is running but cannot connect to PostgreSQL database (ECONNREFUSED error).

## Solution Options

### Option 1: Install PostgreSQL via Homebrew (Recommended)

1. **Install Homebrew** (requires admin password):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install PostgreSQL**:
   ```bash
   brew install postgresql@15
   ```

3. **Start PostgreSQL**:
   ```bash
   brew services start postgresql@15
   ```

4. **Create the database**:
   ```bash
   createdb ocean-erp
   ```

### Option 2: Use Postgres.app (No admin required)

1. Download Postgres.app from: https://postgresapp.com/
2. Install and run the app
3. Click "Initialize" to create a new PostgreSQL server
4. Add PostgreSQL to your PATH:
   ```bash
   echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```
5. Create the database:
   ```bash
   createdb ocean-erp
   ```

### Option 3: Use Docker (if Docker Desktop is installed)

1. Run PostgreSQL in Docker:
   ```bash
   docker run --name ocean-erp-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ocean-erp -p 5432:5432 -d postgres:15
   ```

## Configure Environment Variables

Create `.env.local` file in `apps/v4/`:

```bash
cd /Users/marfreax/Github/ocean-erp/apps/v4
cat > .env.local << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ocean-erp
DB_USER=mac
DB_PASSWORD=

# App Configuration
NEXT_PUBLIC_V0_URL=https://v0.dev
NEXT_PUBLIC_APP_URL=http://localhost:4000
EOF
```

**Note:** Adjust DB_USER and DB_PASSWORD based on your PostgreSQL setup:
- For Homebrew: Usually your macOS username with no password
- For Postgres.app: Usually your macOS username with no password  
- For Docker: Use `postgres` as user and the password you set

## Run Database Migrations

Once PostgreSQL is running and configured:

```bash
cd /Users/marfreax/Github/ocean-erp

# Run the main schema migration
psql ocean-erp < database/01_schema.sql

# Run seed data (optional)
psql ocean-erp < database/02_seed_data.sql
```

## Verify Connection

Test the database connection:

```bash
psql ocean-erp -c "SELECT version();"
```

## Restart the Application

After setup is complete:

```bash
cd /Users/marfreax/Github/ocean-erp
. "$HOME/.nvm/nvm.sh"
pnpm dev
```

Then visit: http://localhost:4000/erp/settings/users

## Current Status

✅ Node.js v20.19.6 installed
✅ pnpm installed
✅ Dependencies installed
✅ Application running on http://localhost:4000
❌ PostgreSQL database not connected

## Next Steps

1. Choose one of the installation options above
2. Install PostgreSQL
3. Create the `.env.local` file with database credentials
4. Run the database migrations
5. The application should then work properly
