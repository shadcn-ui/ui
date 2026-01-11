# Manual Deployment from Local to Server (Without GitHub)

## Prerequisites

### On Your Local Machine:
- `rsync` installed (already included in macOS)
- SSH access to server

### On Server (103.168.135.110):
- SSH access as root
- Nothing else needed (script will install Docker)

---

## Quick Deployment (Automated)

### Single Command Deployment:

```bash
cd /Users/marfreax/Github/ocean-erp
./deploy-manual.sh
```

That's it! The script will:
1. Test SSH connection
2. Transfer all files to server
3. Install Docker on server (if needed)
4. Build and start containers
5. Configure everything automatically

**Access your app at:** http://103.168.135.110

---

## Manual Step-by-Step Deployment

If you prefer to do it manually or if the script fails:

### Step 1: Transfer Files to Server

```bash
# From your local machine
cd /Users/marfreax/Github/ocean-erp

rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude '*.log' \
  ./ root@103.168.135.110:/opt/ocean-erp/
```

**What this does:** Copies your project to server, excluding unnecessary files

---

### Step 2: SSH into Server

```bash
ssh root@103.168.135.110
cd /opt/ocean-erp
```

---

### Step 3: Install Docker (on server)

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
apt-get update
apt-get install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

---

### Step 4: Configure Environment (on server)

```bash
# Copy example environment file
cp .env.production.example .env.production

# Generate secure passwords
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)

# Update environment file
sed -i "s/generate_a_random_secret_key_here_minimum_32_characters/$NEXTAUTH_SECRET/" .env.production
sed -i "s/change_this_to_a_secure_password/$DB_PASSWORD/g" .env.production

# Or edit manually
nano .env.production
```

**Important variables to set:**
- `DB_PASSWORD` - Database password
- `NEXTAUTH_SECRET` - Authentication secret (32+ characters)

---

### Step 5: Create Required Directories (on server)

```bash
mkdir -p apps/v4/public/uploads/profiles
mkdir -p init-db
chmod -R 755 apps/v4/public/uploads
```

---

### Step 6: Build and Deploy (on server)

```bash
# Build containers
docker compose build

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f app
```

---

### Step 7: Verify Deployment

```bash
# Check if containers are running
docker compose ps

# Test the application
curl http://localhost:4000

# Check from your local machine
curl http://103.168.135.110
```

**Access in browser:** http://103.168.135.110

---

## Update Existing Deployment

When you make changes locally and want to update:

```bash
# 1. From local machine - sync changes
cd /Users/marfreax/Github/ocean-erp
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  ./ root@103.168.135.110:/opt/ocean-erp/

# 2. On server - rebuild and restart
ssh root@103.168.135.110 "cd /opt/ocean-erp && docker compose down && docker compose up -d --build"
```

Or use the automated script:
```bash
./deploy-manual.sh
```

---

## Common Issues & Solutions

### SSH Connection Failed?

**Test connection:**
```bash
ssh root@103.168.135.110
```

**If prompted for password:**
- Enter root password for the server
- Or set up SSH key: `ssh-copy-id root@103.168.135.110`

### rsync Not Found?

**Install on macOS:**
```bash
brew install rsync
```

### Docker Build Fails?

**On server, check logs:**
```bash
docker compose logs
```

**Rebuild from scratch:**
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Application Won't Start?

**Check logs:**
```bash
ssh root@103.168.135.110
cd /opt/ocean-erp
docker compose logs app
```

**Common causes:**
- Database not ready (wait 30 seconds)
- Port already in use
- Environment variables not set

### Database Connection Error?

**Check database:**
```bash
docker compose exec postgres psql -U ocean-erp -d ocean-erp -c "SELECT 1"
```

**Reset database:**
```bash
docker compose down -v
docker compose up -d
```

---

## Useful Commands

### On Local Machine:

```bash
# Deploy/Update
./deploy-manual.sh

# Just transfer files (no build)
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ root@103.168.135.110:/opt/ocean-erp/
```

### On Server:

```bash
# View logs
docker compose logs -f app          # Application logs
docker compose logs -f postgres     # Database logs
docker compose logs -f nginx        # Nginx logs

# Manage services
docker compose ps                   # Status
docker compose restart app          # Restart app
docker compose stop                 # Stop all
docker compose up -d                # Start all

# Database operations
docker compose exec postgres psql -U ocean-erp -d ocean-erp    # Access DB
docker compose exec postgres pg_dump -U ocean-erp ocean-erp > backup.sql  # Backup

# System cleanup
docker system prune -a              # Remove unused images/containers
docker compose down -v              # Remove everything including data
```

---

## File Transfer Details

### What Gets Transferred:
- All source code
- Docker configuration files
- Environment templates
- Database schemas (if in init-db/)
- Public assets

### What Gets Excluded:
- `node_modules/` (installed on server)
- `.next/` (built on server)
- `.git/` (not needed)
- `.env.local` (local only)
- Log files
- Cache directories

### Transfer Size:
- First time: ~50-100 MB (depending on assets)
- Updates: Only changed files (usually < 10 MB)

---

## Security Recommendations

1. **Setup SSH Key Authentication**
```bash
# On local machine
ssh-keygen -t rsa -b 4096
ssh-copy-id root@103.168.135.110
```

2. **Configure Firewall on Server**
```bash
# On server
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

3. **Change Default Passwords**
- Review `.env.production` on server
- Change database password
- Update admin user password after first login

4. **Setup SSL (Optional but Recommended)**
```bash
apt install certbot
certbot certonly --standalone -d yourdomain.com
# Update nginx.conf with SSL config
docker compose restart nginx
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Deploy from local** | `./deploy-manual.sh` |
| **Transfer files only** | `rsync -avz --exclude 'node_modules' ./ root@103.168.135.110:/opt/ocean-erp/` |
| **SSH to server** | `ssh root@103.168.135.110` |
| **View app logs** | `docker compose logs -f app` |
| **Restart app** | `docker compose restart app` |
| **Full rebuild** | `docker compose down && docker compose up -d --build` |
| **Access app** | http://103.168.135.110 |

---

## Support

If deployment fails:
1. Check SSH connection: `ssh root@103.168.135.110`
2. Check Docker on server: `docker --version`
3. View logs: `docker compose logs`
4. Try manual steps above
