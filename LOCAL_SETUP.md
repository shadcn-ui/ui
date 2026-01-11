# 🚀 Local Development Setup Guide

Your Mac needs Docker or Node.js to run the application locally. Choose one option:

## ⚡ Quick Option: Docker Desktop (Recommended)

**Easiest way** - everything runs in containers, no other setup needed.

### Install Docker Desktop

1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Wait for Docker to fully start (whale icon in menu bar should be steady)

### Run the Application

```bash
# Test that Docker is installed
docker --version

# Start the application
./scripts/test_local_docker.sh

# Access at http://localhost:4000
```

---

## 🛠️ Alternative: Node.js Development

**For active development** - faster iteration, hot-reload.

### Install Node.js

1. Download from: https://nodejs.org/ (get v20 LTS)
2. Or use Homebrew:
   ```bash
   brew install node@20
   ```

### Install pnpm

```bash
npm install -g pnpm
```

### Install PostgreSQL via Docker (easier than native install)

```bash
docker run -d \
  --name ocean-erp-postgres \
  -e POSTGRES_USER=ocean_erp \
  -e POSTGRES_PASSWORD=ocean_erp \
  -e POSTGRES_DB=ocean_erp \
  -p 5432:5432 \
  postgres:16-alpine
```

### Run the Application

```bash
# Install dependencies
pnpm install

# Start dev server
cd apps/v4
pnpm dev

# Access at http://localhost:4000
```

---

## 🎯 Which Should You Choose?

**Choose Docker Desktop if:**
- ✅ You want the simplest setup
- ✅ You want to test exactly like production
- ✅ You don't need hot-reload during development

**Choose Node.js if:**
- ✅ You're actively developing/debugging
- ✅ You want faster iteration
- ✅ You want to use dev tools

---

## 🔧 After Installation

Once you have Docker OR Node.js installed:

### For Docker:
```bash
./scripts/test_local_docker.sh
```

### For Node.js:
```bash
./scripts/run_local.sh
```

Then access: **http://localhost:4000**

---

## ⚠️ Common Issues

**"command not found: docker"**
- Install Docker Desktop and make sure it's running

**"command not found: pnpm"**
- Install Node.js first, then: `npm install -g pnpm`

**"Port 4000 already in use"**
```bash
# Find what's using it
lsof -ti:4000

# Kill it
kill -9 $(lsof -ti:4000)
```

---

## 📋 Next Steps

1. Install Docker Desktop OR Node.js (see above)
2. Run the appropriate setup script
3. Access http://localhost:4000
4. Once working locally, deploy to server:
   ```bash
   ./scripts/fresh_deploy.sh root@103.168.135.169
   ```
