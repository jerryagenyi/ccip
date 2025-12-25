# Traefik Routing Fix - CCIP Frontend

## Root Cause Identified (UPDATED AFTER DEEP INVESTIGATION)

The Traefik 404 error is caused by **Dokploy's Traefik docker-compose.yml missing critical volume mounts**.

### The Real Problem

**Dokploy has proper Traefik configuration files on the host:**
- `/etc/dokploy/traefik/traefik.yml` - Main config with entrypoints, providers, certificate resolvers
- `/etc/dokploy/traefik/dynamic/middlewares.yml` - Defines `redirect-to-https` middleware  
- `/etc/dokploy/traefik/dynamic/acme.json` - SSL certificates

**But `/etc/dokploy/docker-compose.yml` only mounts the Docker socket:**
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
```

**Missing mounts that should be there:**
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
  - /etc/dokploy/traefik/traefik.yml:/etc/traefik/traefik.yml:ro
  - /etc/dokploy/traefik/dynamic:/etc/dokploy/traefik/dynamic
```

This means Traefik is running with **DEFAULT configuration only**, which:
1. ❌ Has no Docker provider enabled (ignores all container labels)
2. ❌ Has no entrypoints named `web` or `websecure`
3. ❌ Has no certificate resolver named `letsencrypt`
4. ❌ Has no file provider for middlewares

### Secondary Issues (in your app compose)

1. **Missing `traefik.enable=true`** - Won't matter until Traefik is configured properly
2. **`redirect-to-https@file` middleware** - Actually DOES exist in `/etc/dokploy/traefik/dynamic/middlewares.yml`, but Traefik can't see it because the file isn't mounted

---

## THE FIX: Two Steps Required

### Step 1: Fix Dokploy's Traefik docker-compose.yml (CRITICAL)

Update `/etc/dokploy/docker-compose.yml` on the server:

**Current (BROKEN):**
```yaml
version: "3.8"

services:
  traefik:
    image: traefik:v3.6.1
    container_name: dokploy-traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    networks:
      - dokploy-network
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro

networks:
  dokploy-network:
    external: true
```

**Fixed:**
```yaml
version: "3.8"

services:
  traefik:
    image: traefik:v3.6.1
    container_name: dokploy-traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    networks:
      - dokploy-network
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /etc/dokploy/traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - /etc/dokploy/traefik/dynamic:/etc/dokploy/traefik/dynamic

networks:
  dokploy-network:
    external: true
```

**Then restart Traefik:**
```bash
cd /etc/dokploy
sudo docker compose down
sudo docker compose up -d
```

### Step 2: Ensure Your App Labels Are Correct

Your app's `docker-compose.production.yml` frontend labels should include `traefik.enable=true`:

```yaml
frontend:
  # ... build config ...
  labels:
    - "traefik.enable=true"  # ✅ CRITICAL
    - "traefik.docker.network=dokploy-network"
    # HTTP router (NO redirect middleware when using Cloudflare)
    - "traefik.http.routers.ccip-frontend-web.rule=Host(`ccip.jerryagenyi.xyz`)"
    - "traefik.http.routers.ccip-frontend-web.entrypoints=web"
    - "traefik.http.routers.ccip-frontend-web.service=ccip-frontend-web"
    - "traefik.http.services.ccip-frontend-web.loadbalancer.server.port=80"
    # HTTPS router
    - "traefik.http.routers.ccip-frontend-websecure.rule=Host(`ccip.jerryagenyi.xyz`)"
    - "traefik.http.routers.ccip-frontend-websecure.entrypoints=websecure"
    - "traefik.http.routers.ccip-frontend-websecure.tls.certresolver=letsencrypt"
    - "traefik.http.routers.ccip-frontend-websecure.service=ccip-frontend-websecure"
    - "traefik.http.services.ccip-frontend-websecure.loadbalancer.server.port=80"
```

**Important:** If using Cloudflare proxy, do NOT use the `redirect-to-https@file` middleware - it creates a redirect loop since both Cloudflare and Traefik try to redirect HTTP→HTTPS.

---

## How to Apply the Fix

### Via SSH with sudo:
```bash
ssh ja@100.123.6.36

# Step 1: Fix Traefik compose
sudo nano /etc/dokploy/docker-compose.yml
# Add the volume mounts shown above

# Restart Traefik with new config
cd /etc/dokploy
sudo docker compose down
sudo docker compose up -d

# Verify Traefik is configured correctly
docker logs dokploy-traefik 2>&1 | head -20
# Should show it loading the config file and docker provider

# Step 2: Redeploy your app (via Dokploy UI or compose)
```

### Via Dokploy UI:
The Traefik compose file at `/etc/dokploy/docker-compose.yml` is a system file - you may need to access it via SSH with sudo rather than through the Dokploy UI.

## Verification Steps

After applying the fix:

1. **Verify Traefik loaded config:**
   ```bash
   docker exec dokploy-traefik cat /etc/traefik/traefik.yml
   # Should show the config file contents
   ```

2. **Check Traefik API is now available:**
   ```bash
   curl http://127.0.0.1:8080/api/http/routers | jq
   # Should show your routers
   ```

3. **Check routing works:**
   ```bash
   curl -H "Host: ccip.jerryagenyi.xyz" http://127.0.0.1/
   # Should return HTML, not 404
   ```

4. **Test HTTPS:**
   ```bash
   curl https://ccip.jerryagenyi.xyz
   # Should return frontend HTML
   ```

## Why This Fixes It

The core issue was that Dokploy's Traefik container was running without its configuration file mounted:

- **Without config**: Traefik runs with defaults only - no Docker provider, no entrypoints, no cert resolver
- **With config mounted**: Traefik loads `/etc/traefik/traefik.yml` which defines:
  - Docker provider with `exposedByDefault: false`
  - Entrypoints: `web` (:80) and `websecure` (:443)
  - Let's Encrypt certificate resolver
  - File provider for dynamic config (middlewares)

## Network Verification (Already Confirmed ✅)

Both Traefik and frontend are on `dokploy-network`:
- Traefik: `10.0.1.16` on `dokploy-network`
- Frontend: `10.0.1.15` on `dokploy-network`
- Network ID matches: `dgebcayyml9gig8ppn86le957`

Network connectivity is **not** the issue.

## Evidence from Investigation

```bash
# Traefik config exists on host
$ cat /etc/dokploy/traefik/traefik.yml
# Shows proper config with providers, entrypoints, etc.

# But not mounted in container
$ docker exec dokploy-traefik cat /etc/traefik/traefik.yml
# NO CONFIG FILE

# Container only has docker socket mounted
$ docker inspect dokploy-traefik --format '{{ json .Mounts }}'
# Only shows /var/run/docker.sock

# Traefik is listening on port 80 only (not 443) inside container
$ docker exec dokploy-traefik ss -tlnp
# Only shows :80, not :443 - because websecure entrypoint isn't configured
```

## Cloudflare + Traefik Redirect Loop

If you see `ERR_TOO_MANY_REDIRECTS` after fixing Traefik config, it's because:

1. **Cloudflare** is set to redirect HTTP→HTTPS (at edge)
2. **Traefik** also has `redirect-to-https@file` middleware
3. This creates an infinite loop

**Solution:** Remove the `redirect-to-https@file` middleware from your Traefik labels. Let Cloudflare handle the HTTPS redirect at the edge.

```bash
# Test locally (should return HTML, not a redirect)
curl -H "Host: ccip.jerryagenyi.xyz" http://127.0.0.1/
```
