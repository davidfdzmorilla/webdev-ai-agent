# Deployment Guide — webdev-ai-agent

## Current Status: ✅ Application Deployed (Nginx/SSL Pending)

**Date**: 2026-02-15  
**Version**: 1.0.0

---

## Deployment Checklist

### ✅ Completed

- [x] Docker image built successfully
- [x] Docker containers running (app + postgres)
  - `webdev-ai-agent-app-1` on port 3009:3000
  - `webdev-ai-agent-postgres-1` on port 5435:5432 (healthy)
- [x] Database migrations applied
- [x] Application accessible on localhost:3009
- [x] Health check endpoint returns healthy status
- [x] Cloudflare DNS configured (agent.davidfdzmorilla.dev → 46.225.106.199, proxied)
- [x] Nginx configuration prepared (/tmp/agent.davidfdzmorilla.dev)
- [x] Deployment script created (scripts/deploy-nginx-ssl.sh)

### ⏳ Pending Manual Steps (Requires Sudo)

- [ ] Deploy nginx configuration
- [ ] Request SSL certificate

---

## Manual Deployment Steps

To complete the deployment, run the following command **with sudo**:

```bash
cd ~/projects/webdev-ai-agent
sudo bash scripts/deploy-nginx-ssl.sh
```

This script will:
1. Copy nginx config to `/etc/nginx/sites-available/`
2. Enable the site (symlink to `sites-enabled`)
3. Test nginx configuration
4. Reload nginx
5. Request SSL certificate via certbot

---

## Verification

### 1. Local Verification (Already Passing)

```bash
# Application loads
curl -s http://localhost:3009 | grep -i "<title>"
# Returns: <title>AI Agent - Function Calling Demo</title>

# Health check
curl -s http://localhost:3009/api/health | jq .
# Returns:
# {
#   "status": "healthy",
#   "database": "connected",
#   "openai": "missing",
#   "timestamp": "..."
# }

# Container status
docker compose ps
# Both containers Up and healthy
```

### 2. After Nginx/SSL Setup

```bash
# DNS resolution
dig +short agent.davidfdzmorilla.dev
# Should return Cloudflare IPs (104.21.x.x, 172.67.x.x)

# HTTPS check
curl -sI https://agent.davidfdzmorilla.dev | head -5
# Should return HTTP/2 200

# SSL certificate
curl -sv https://agent.davidfdzmorilla.dev 2>&1 | grep "SSL certificate verify ok"
```

---

## Configuration

### Environment Variables

The application currently runs with:
- `DATABASE_URL`: `postgresql://agent_user:agent_password@postgres:5432/agent_db`
- `OPENAI_API_KEY`: **NOT SET** (⚠️ Required for agent functionality)

To enable full functionality, add `OPENAI_API_KEY` to docker-compose.yml:

```bash
# Create .env file
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# Restart containers
docker compose down
docker compose up -d
```

### Ports

- **Application**: localhost:3009 → container:3000
- **PostgreSQL**: localhost:5435 → container:5432
- **Nginx**: 80/443 → localhost:3009

---

## Container Management

### Start/Stop

```bash
cd ~/projects/webdev-ai-agent

# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker logs webdev-ai-agent-app-1 -f
docker logs webdev-ai-agent-postgres-1 -f

# Restart
docker compose restart
```

### Database Migrations

```bash
# Generate migration
pnpm db:generate

# Apply migration
DATABASE_URL="postgresql://agent_user:agent_password@localhost:5435/agent_db" pnpm drizzle-kit migrate

# Open Drizzle Studio
DATABASE_URL="postgresql://agent_user:agent_password@localhost:5435/agent_db" pnpm db:studio
```

---

## Troubleshooting

### Application won't start

```bash
# Check logs
docker logs webdev-ai-agent-app-1 --tail 50

# Common issues:
# - Missing DATABASE_URL
# - Database not ready (check postgres health)
# - Port 3009 already in use
```

### Database connection failed

```bash
# Check postgres health
docker compose ps
# Status should be "healthy"

# Test connection
docker exec -it webdev-ai-agent-postgres-1 psql -U agent_user -d agent_db -c "SELECT 1;"
```

### OPENAI_API_KEY missing

This is expected if you haven't configured it. The application will work but agent functionality (chat) will fail. Add the key to `.env` and restart.

---

## Architecture

```
Internet → Cloudflare DNS
              ↓
          46.225.106.199 (Server IP)
              ↓
          Nginx :80/443
              ↓
          localhost:3009 (Docker)
              ↓
     webdev-ai-agent-app-1 (Next.js)
              ↓
     webdev-ai-agent-postgres-1 (PostgreSQL)
```

---

## Next Steps

1. Run `sudo bash scripts/deploy-nginx-ssl.sh`
2. Verify https://agent.davidfdzmorilla.dev is accessible
3. Add OPENAI_API_KEY to .env
4. Restart containers
5. Test agent functionality (chat interface)
6. Update portfolio with project link

---

## Deployment Log

- **2026-02-15 05:14 UTC**: Containers deployed and running
- **2026-02-15 05:14 UTC**: Database migrations applied
- **2026-02-15 05:15 UTC**: Application verified on localhost:3009
- **2026-02-15 05:10 UTC**: Cloudflare DNS configured
- **2026-02-15 05:10 UTC**: Nginx config prepared

**Status**: Ready for final nginx/SSL setup
