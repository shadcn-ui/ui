# Ocean ERP Server Deployment Guide

Complete step-by-step guide to deploy Ocean ERP to your server (103.168.135.110).

## Quick Start (RECOMMENDED for Empty Server)

This is the fastest method when your server is currently empty.

### Step 1: Upload Files from Your Local Machine

From your local machine (where the code is):

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Upload to server
./scripts/upload_to_server.sh root@103.168.135.110 /opt/ocean-erp
```

### Step 2: Deploy on Server

SSH into your server:

```bash
ssh root@103.168.135.110
```

Then run the deployment:

```bash
cd /opt/ocean-erp
sudo bash scripts/deploy_to_server.sh
```

This single command will:
- ✓ Install Docker and Docker Compose
- ✓ Generate secure environment configuration
- ✓ Build Docker images
- ✓ Start all services (PostgreSQL, App, Nginx)

### Step 3: Verify Deployment

```bash
cd /opt/ocean-erp
bash scripts/verify_deployment.sh http://103.168.135.110
```

### Step 4: Access Your Application

- **Via Nginx**: http://103.168.135.110
- **Direct App**: http://103.168.135.110:4000

---

## Alternative: Manual Step-by-Step

If the automated scripts don't work, follow these manual steps:

### 1. Install Docker on Server

SSH into server and run:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
```

### 2. Upload Application Files

From your local machine:

```bash
# Option A: Using the upload script
cd /Users/marfreax/Github/ocean-erp
chmod +x scripts/upload_to_server.sh
./scripts/upload_to_server.sh root@103.168.135.110 /opt/ocean-erp
```

Or manually with tar:

```bash
# Create archive (from local machine)
cd /Users/marfreax/Github/ocean-erp
tar czf ocean-erp.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='tmp' \
  .

# Upload to server
scp ocean-erp.tar.gz root@103.168.135.110:/opt/

# Extract on server
ssh root@103.168.135.110
cd /opt
mkdir -p ocean-erp
tar xzf ocean-erp.tar.gz -C ocean-erp
cd ocean-erp
```

### 3. Configure Environment

On the server:

```bash
cd /opt/ocean-erp

# Create .env file
cat > .env <<'EOF'
DB_USER=ocean_erp
DB_PASSWORD=$(openssl rand -hex 16)
DB_NAME=ocean_erp

NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://103.168.135.110:4000

POS_BASE_URL=http://103.168.135.110:4000
EOF

# Create required directories
mkdir -p apps/v4/public/uploads
mkdir -p ssl
```

### 4. Build and Start Services

```bash
cd /opt/ocean-erp

# Build images
docker compose build

# Start services
docker compose up -d

# Check status
docker compose ps
```

### 5. Verify Deployment

```bash
# Check if services are running
docker compose ps

# View logs
docker compose logs -f

# Test application
curl http://103.168.135.110
curl http://103.168.135.110:4000
```

---

## Troubleshooting

### Check Container Status

```bash
cd /opt/ocean-erp
docker compose ps
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart app
```

### Common Issues

**1. Port already in use**
```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :4000

# Stop the conflicting service
sudo systemctl stop apache2  # if Apache is running
sudo systemctl stop nginx    # if Nginx is running outside Docker
```

**2. Database connection errors**
```bash
# Check database is ready
docker compose exec postgres pg_isready -U ocean_erp

# View database logs
docker compose logs postgres
```

**3. Build fails**
```bash
# Clean rebuild
docker compose down -v
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

**4. Permission issues**
```bash
# Fix ownership
cd /opt/ocean-erp
sudo chown -R $(whoami):$(whoami) .
```

---

## Maintenance Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart app
```

### Stop Services

```bash
docker compose stop
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d
```

### Database Backup
```bash
# Create backup
docker compose exec postgres pg_dump -U ocean_erp ocean_erp > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker compose exec -T postgres psql -U ocean_erp ocean_erp < backup_file.sql
```

### Clean Up
```bash
# Remove containers (keeps data)
docker compose down

# Remove containers and volumes (deletes data)
docker compose down -v

# Remove old images
docker image prune -a
```

## Security Recommendations

1. **Firewall Configuration**
```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

2. **SSL/HTTPS Setup** (Recommended)
```bash
# Install Certbot
sudo apt install certbot -y

# Get SSL certificate (after setting up domain)
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem

# Update nginx.conf to enable HTTPS section
# Restart nginx
docker compose restart nginx
```

3. **Change Default Passwords**
- Database password
- Admin user password (after first login)

4. **Regular Updates**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

## Monitoring

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h
docker system df
```

### Health Checks
```bash
# Application health
curl http://103.168.135.110/health

# Database health
docker compose exec postgres pg_isready -U ocean_erp
```

## Troubleshooting

### Application Won't Start
```bash
# Check logs
docker compose logs app

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Database Connection Issues
```bash
# Check database is running
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U ocean_erp -d ocean_erp -c "SELECT 1"

# Check environment variables
docker compose exec app env | grep DATABASE_URL
```

### Permission Issues
```bash
# Fix uploads directory permissions
sudo chown -R 1001:1001 apps/v4/public/uploads
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Strong passwords set
- [ ] Database initialized with schema
- [ ] Firewall configured
- [ ] SSL certificates installed (optional but recommended)
- [ ] Regular backup strategy in place
- [ ] Monitoring set up
- [ ] Admin credentials changed from defaults

## Support

For issues, check:
1. Application logs: `docker compose logs -f app`
2. Database logs: `docker compose logs -f postgres`
3. Nginx logs: `docker compose logs -f nginx`
