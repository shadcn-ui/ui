# Ocean ERP - Deployment via Termius

## Step-by-Step Guide

### Prerequisites
- Connected to server via Termius (root@103.168.135.110)
- Docker is already installed ✓

---

## Step 1: Navigate to Project Directory

```bash
cd /opt/ocean-erp
```

---

## Step 2: Verify Docker Installation

```bash
docker --version
docker compose version
```

You should see:
- Docker version 27.4.1
- Docker Compose version v2.31.0

---

## Step 3: Create Environment File

```bash
cat > .env.production << 'EOF'
# Database Configuration
DB_USER=ocean_erp
DB_PASSWORD=OceanERP2024Secure
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ocean_erp

# Database URL
DATABASE_URL=postgresql://ocean_erp:OceanERP2024Secure@postgres:5432/ocean_erp

# NextAuth Configuration
NEXTAUTH_URL=http://103.168.135.110
NEXTAUTH_SECRET=REPLACE_THIS_WITH_RANDOM_STRING

# Environment
NODE_ENV=production
EOF
```

---

## Step 4: Generate Secure Secret

```bash
# Generate a random secret and update the env file
NEXTAUTH_SECRET=$(openssl rand -base64 32)
sed -i "s/REPLACE_THIS_WITH_RANDOM_STRING/$NEXTAUTH_SECRET/g" .env.production

# Verify the file
cat .env.production
```

---

## Step 5: Create Required Directories

```bash
mkdir -p apps/v4/public/uploads/profiles
mkdir -p init-db
chmod -R 755 apps/v4/public/uploads
```

---

## Step 6: Database Initialization

The database will be automatically initialized when you start the containers. PostgreSQL will run the SQL files from the `init-db/` directory.

If you want to manually initialize:

```bash
# Wait for PostgreSQL to start
docker compose up -d postgres
sleep 10

# Run initialization script (if available on server)
docker compose exec postgres psql -U ocean_erp -d ocean_erp -f /docker-entrypoint-initdb.d/00-init.sql
```

Or connect to PostgreSQL and run SQL files manually:

```bash
# Access PostgreSQL
docker compose exec postgres psql -U ocean_erp -d ocean_erp

# Inside psql, you can run commands like:
# \dt                    -- list tables
# \l                     -- list databases
# \q                     -- quit
```

---

## Step 7: Start All Containers

```bash
# Start all services (PostgreSQL, App, Nginx)
docker compose up -d

# This will:
# 1. Start PostgreSQL on port 5432
# 2. Initialize the database
# 3. Build and start the Next.js application on port 4000
# 4. Start Nginx reverse proxy on port 80
```

**Note:** First build will take 5-10 minutes as it needs to pull base images and install dependencies.

---

## Step 8: Monitor the Build/Startup

```bash
# Watch the logs in real-time
docker compose logs -f

# Or watch specific service:
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx

# Press Ctrl+C to stop watching logs (containers keep running)
```

---

## Step 9: Check Container Status

```bash
# Check if all containers are running
docker compose ps

# You should see 3 services running:
# - postgres (healthy)
# - app (running)
# - nginx (running)
```

---

## Step 10: Verify Application

```bash
# Test from server
curl http://localhost:4000

# Test nginx proxy
curl http://localhost

# Check database connection
docker compose exec postgres psql -U ocean_erp -d ocean_erp -c "SELECT COUNT(*) FROM users;"
```

---

## Step 11: Access from Browser

Open your browser and go to:
- **http://103.168.135.110**

Login credentials (from seed data):
- **Administrator:** umar@oceanerp.com / password
- **Sales Team:** raymond@oceanerp.com / password

---

## Common Commands

### View Logs
```bash
docker compose logs -f app          # Application logs
docker compose logs --tail=50 app   # Last 50 lines
```

### Restart Services
```bash
docker compose restart app          # Restart just the app
docker compose restart              # Restart all services
```

### Stop Services
```bash
docker compose stop                 # Stop all containers
docker compose down                 # Stop and remove containers
```

### Rebuild After Code Changes
```bash
docker compose down
docker compose up -d --build
```

### Database Backup
```bash
docker compose exec postgres pg_dump -U ocean_erp ocean_erp > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
cat backup.sql | docker compose exec -T postgres psql -U ocean_erp ocean_erp
```

---

## Troubleshooting

### If containers won't start:
```bash
# Check container logs
docker compose logs

# Check specific service
docker compose logs postgres
docker compose logs app

# Remove everything and start fresh
docker compose down -v
docker compose up -d
```

### If database won't initialize:
```bash
# Access PostgreSQL directly
docker compose exec postgres bash
psql -U ocean_erp -d ocean_erp

# Inside psql, check tables:
\dt
```

### If port 80 is in use:
```bash
# Check what's using port 80
lsof -i :80

# Or use different port by editing docker-compose.yml
```

---

## Next Steps After Deployment

1. **Change default passwords** - Update user passwords from the default "password"
2. **Configure SSL/HTTPS** - Set up Let's Encrypt for secure access
3. **Setup monitoring** - Configure log monitoring and alerts
4. **Database backups** - Set up automated daily backups
5. **Firewall configuration** - Only allow ports 22, 80, 443

---

## Important Files on Server

- `/opt/ocean-erp/.env.production` - Environment configuration
- `/opt/ocean-erp/docker-compose.yml` - Docker services configuration
- `/opt/ocean-erp/Dockerfile` - Application container definition
- `/opt/ocean-erp/init-db/` - Database initialization SQL files
- `/opt/ocean-erp/apps/v4/public/uploads/` - User uploaded files

---

## Support

If you encounter any issues:
1. Check logs: `docker compose logs -f`
2. Verify .env.production has correct values
3. Ensure database password matches in both .env.production and docker-compose.yml
4. Check if all required ports are available (80, 4000, 5432)

