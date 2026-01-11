# 🚀 Quick Deployment to 103.168.135.110

## Option 1: Automated Deployment (Recommended)

```bash
# On your server
ssh root@103.168.135.110

# Clone repository
cd /opt
git clone https://github.com/marfreax/ocean-erp.git
cd ocean-erp

# Run automated deployment
sudo bash deploy.sh
```

That's it! The script will:
- Install Docker & Docker Compose
- Generate secure passwords
- Build containers
- Start all services

Access at: **http://103.168.135.110**

---

## Option 2: Manual Deployment

```bash
# On your server
ssh root@103.168.135.110

# 1. Install Docker
curl -fsSL https://get.docker.com | sh

# 2. Clone repository
cd /opt
git clone https://github.com/marfreax/ocean-erp.git
cd ocean-erp

# 3. Setup environment
cp .env.production.example .env.production
nano .env.production  # Edit passwords

# 4. Deploy
docker compose up -d

# 5. Check status
docker compose ps
docker compose logs -f app
```

---

## Essential Commands

```bash
# View logs
docker compose logs -f app

# Restart application
docker compose restart app

# Stop everything
docker compose down

# Update application
git pull && docker compose up -d --build

# Database backup
docker compose exec postgres pg_dump -U ocean_erp ocean_erp > backup.sql
```

---

## URLs After Deployment

- **Main App**: http://103.168.135.110
- **Direct Access**: http://103.168.135.110:4000
- **Login**: http://103.168.135.110/login

---

## Troubleshooting

**App won't start?**
```bash
docker compose logs app
```

**Database issues?**
```bash
docker compose exec postgres psql -U ocean_erp -d ocean_erp
```

**Reset everything?**
```bash
docker compose down -v
docker compose up -d
```

---

## Security Setup (After Deployment)

1. **Configure Firewall**
```bash
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
```

2. **Change Default Passwords**
- Login to app and change admin password
- Update database password in .env.production

3. **Setup SSL (Optional)**
```bash
apt install certbot
certbot certonly --standalone -d yourdomain.com
# Update nginx.conf with SSL config
docker compose restart nginx
```

---

## Need Help?

Check the detailed guide: `DEPLOYMENT_GUIDE.md`
