# CCIP Deployment Resolution Guide
## Traefik Routing & Dokploy Configuration Issues

**Date:** December 19, 2025  
**Status:** ✅ Frontend fully resolved | ⚠️ Backend database config pending  
**Outcome:** Critical Traefik misconfiguration identified and fixed; frontend now live at `ccip.jerryagenyi.xyz`

---

## Executive Summary

The CCIP deployment encountered **three distinct categories of issues**:

1. **Critical: Traefik missing configuration files** (volume mounts not defined)
2. **Major: Dokploy auto-injecting HTTPS redirect middleware** (conflicting with Cloudflare)
3. **Secondary: Laravel configuration & syntax errors** (application-level, not deployment-related)

**Root cause:** Dokploy's default `docker-compose.yml` for Traefik only mounted the Docker socket, not the actual Traefik configuration files that were present on the host filesystem.

---

## Issue #1: Traefik Configuration Missing (CRITICAL)

### The Problem

**Symptom:** 
```
curl -H "Host: ccip.jerryagenyi.xyz" http://127.0.0.1/
→ 404 page not found
```

Direct port access worked:
```
http://72.61.19.90:32823/  → ✅ Served frontend HTML
```

But domain routing via Traefik failed.

### Root Cause

The `/etc/dokploy/docker-compose.yml` had this:

```yaml
services:
  traefik:
    image: traefik:v3.6.1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    # ❌ MISSING: Traefik config files!
```

Meanwhile, on the **host filesystem**, the actual config files existed:
- `/etc/dokploy/traefik/traefik.yml` — Main Traefik configuration
- `/etc/dokploy/traefik/dynamic/middlewares.yml` — Dynamic middleware definitions
- `/etc/dokploy/traefik/acme.json` — SSL certificates

**Result:** Traefik was running with **default configuration only**, which means:
- ❌ No Docker provider enabled (ignores container labels)
- ❌ No entrypoints named `web` or `websecure`
- ❌ No certificate resolver named `letsencrypt`
- ❌ No dynamic middleware definitions

### Diagnostic Steps

```bash
# Step 1: Check if config exists on host
cat /etc/dokploy/traefik/traefik.yml
# → Output: Full config with providers, entrypoints, etc.

# Step 2: Check if it's mounted in container
docker exec dokploy-traefik cat /etc/traefik/traefik.yml
# → Error: No such file or directory

# Step 3: Check what Traefik is actually listening on
docker exec dokploy-traefik ss -tlnp
# → Output: Only :80 listening (no :443 inside container, despite port 443 exposed)
```

### The Fix

Updated `/etc/dokploy/docker-compose.yml` to mount the config files:

```yaml
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
      - /etc/dokploy/traefik/acme.json:/etc/traefik/acme.json
```

Then restart Traefik:

```bash
cd /etc/dokploy
sudo docker compose down
sudo docker compose up -d
```

**Verification:**
```bash
# Now config is mounted
docker exec dokploy-traefik cat /etc/traefik/traefik.yml | head -20
# → Shows actual configuration

# Now listening on both ports
docker exec dokploy-traefik ss -tlnp | grep -E ':80|:443'
# → :80 and :443 both present
```

---

## Issue #2: HTTPS Redirect Loop (Cloudflare Conflict)

### The Problem

After fixing Issue #1, routing worked but created an infinite redirect:

```
curl -H "Host: ccip.jerryagenyi.xyz" http://127.0.0.1/
→ HTTP/1.1 308 Permanent Redirect
→ Location: https://ccip.jerryagenyi.xyz
```

Browser showed:
```
ERR_TOO_MANY_REDIRECTS
ccip.jerryagenyi.xyz redirected you too many times.
```

### Root Cause

**Two redirect mechanisms competing:**

1. **Cloudflare** (at DNS/network edge):
   - Client sends HTTPS request to `ccip.jerryagenyi.xyz`
   - Cloudflare forwards to origin as HTTP (or proxies)

2. **Traefik** (at app layer):
   - Receives HTTP request
   - Middleware `redirect-to-https@file` redirects back to HTTPS
   - Cloudflare receives the redirect, sends it to client
   - Client follows redirect → loop repeats

**Dokploy was auto-injecting this middleware** via its Domains UI. When you configure a domain through Dokploy, it automatically adds:

```yaml
traefik.http.routers.{service}-web.middlewares: redirect-to-https@file
```

This is designed for single-origin deployments without reverse proxies, but **breaks with Cloudflare**.

### The Fix

**In Dokploy UI**, for each domain (frontend, backend, MinIO):
1. Go to **Project** → **Service** → **Domains**
2. Edit each domain
3. Look for **"HTTPS Redirect"** or **"Redirect to HTTPS"** toggle
4. **Disable it** (Cloudflare handles HTTP→HTTPS at the edge)
5. Save and redeploy

Alternatively, manually edit the compose file and remove lines like:

```yaml
# ❌ Remove this
- traefik.http.routers.ccip-compose-8cmhkg-8-web.middlewares=redirect-to-https@file

# ✅ Keep these (Traefik routes traffic on both ports without redirect)
- traefik.http.routers.ccip-compose-8cmhkg-8-web.rule=Host(`ccip.jerryagenyi.xyz`)
- traefik.http.routers.ccip-compose-8cmhkg-8-web.entrypoints=web
```

**Why this works:** Cloudflare handles the HTTP→HTTPS redirect at the CDN edge. Traefik receives the request on port 80 and simply routes it to the container without forcing a redirect. The browser still gets HTTPS because Cloudflare handled it upstream.

---

## Issue #3: Laravel Configuration & Syntax Errors

### The Problem

After routing was fixed, the backend returned `HTTP 500`:

```
GET /api/v1/activities → 500 Internal Server Error
```

### Root Causes (Multiple)

#### 3a. PHP Syntax Error

**File:** `app/Http/Controllers/ActivityController.php`, line 198

**Before:**
```php
$attachment = ActivityAttachment::create([                'activity_id' => $id,                'name' => $file->getClientOriginalName(), ...]);
```

All array elements were concatenated on one line with improper formatting.

**After:**
```php
$attachment = ActivityAttachment::create([
    'activity_id' => $id,
    'name' => $file->getClientOriginalName(),
    'file_name' => $file->getClientOriginalName(),
    'file_path' => $path,
    'type' => $file->getClientOriginalExtension(),
    'file_type' => $file->getClientOriginalExtension(),
    'size' => $file->getSize(),
    'file_size' => $file->getSize(),
    'mime_type' => $file->getMimeType(),
    'uploaded_by' => $request->user()->id,
]);
```

#### 3b. Missing Laravel Config Files

**Symptom:**
```
Illuminate\View\FileViewFinder::__construct(): Argument #2 ($paths) must be of type array, null given
```

**Root cause:** `config/view.php` was missing from the Laravel project.

**Fix:** Added standard Laravel config files:
- `config/view.php` — View paths configuration
- `config/cache.php` — Cache drivers
- `config/session.php` — Session configuration
- `config/logging.php` — Logging configuration
- `config/filesystems.php` — Storage disks
- `config/sanctum.php` — API authentication

These files are normally auto-generated when you run `composer create-project laravel/laravel` but were missing from the Git repo.

#### 3c. Missing Database Sessions Table

**Symptom:**
```
SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "sessions" does not exist
```

**Root cause:** Laravel was configured to use `SESSION_DRIVER=database` but the migration hadn't been run.

**Temporary fix:** Set `SESSION_DRIVER=file` in the compose environment to allow the app to run while database setup happens.

**Permanent fix:** Run migrations to create the sessions table:
```bash
php artisan migrate
```

#### 3d. Invalid APP_KEY

**Issue:** The `.env` file contained:
```
APP_KEY=base64:YOUR_LARAVEL_KEY_HERE
```

This is a placeholder, not a real key. Laravel needs a real 32-byte base64-encoded key.

**Fix:** Generate a proper key:
```bash
php artisan key:generate
```

---

## Would Dokploy Documentation Prevent These Issues?

**Short answer:** Partially, but no—these are **edge cases and deployment-specific issues**, not documented gotchas.

### What Dokploy docs cover:
✅ Basic Dokploy setup and UI navigation  
✅ How to add services and domains through the UI  
✅ How to configure environment variables  
✅ How to deploy from Git

### What they DON'T cover:
❌ What happens when Traefik volume mounts are missing  
❌ How Cloudflare interacts with Dokploy's auto-redirect middleware  
❌ Debugging Traefik's Docker provider when config files aren't mounted  
❌ Why the API returns 500 (application-level debugging)

### Why you encountered these issues:

1. **Issue #1 (Traefik config)** — Dokploy was configured by someone previously, and the `/etc/dokploy/docker-compose.yml` was incomplete. This isn't documented because Dokploy assumes the system is set up correctly.

2. **Issue #2 (Cloudflare redirect)** — The `redirect-to-https@file` middleware is a Dokploy default that makes sense for standalone deployments but **breaks with Cloudflare**. The docs don't mention this because it's an edge case.

3. **Issue #3 (Laravel config)** — These are application-level issues, not deployment issues. If you'd built the Laravel app from scratch with `composer create-project`, the config files would exist.

---

## Summary: Was This Preventable?

### If you'd built from scratch with Dokploy:

```bash
# Fresh Laravel project
composer create-project laravel/laravel ccip

# Fresh Dokploy setup
# → Traefik volumes would be correct out-of-the-box
# → Config files would be generated correctly
```

You **likely would have avoided Issues #1 and #3**, but **Issue #2 would still occur** because Dokploy doesn't document the redirect-middleware-with-Cloudflare gotcha.

### Why you hit them:

1. **Inheriting a partially-configured system** — The server had Dokploy already set up, but incompletely
2. **Using Cloudflare in front of Dokploy** — This is not a standard Dokploy use case
3. **Existing Laravel codebase** — Not built fresh with Dokploy scaffolding

---

## Key Lessons

1. **Traefik diagnostic checklist:**
   - ✅ Config files exist on host? 
   - ✅ Are they mounted in the container?
   - ✅ Is the Docker provider enabled in config?
   - ✅ Are entrypoints defined?
   - ✅ Test with `curl -H "Host: domain" http://127.0.0.1/`

2. **Cloudflare + Traefik requires:**
   - ✅ Disable redirect-to-HTTPS at Traefik level
   - ✅ Let Cloudflare handle the redirect at the edge
   - ✅ Both HTTP and HTTPS routes should go to the same backend

3. **Laravel on Docker requires:**
   - ✅ All config files present (generated by `composer create-project` or manually added)
   - ✅ Environment variables properly set
   - ✅ Database migrations run
   - ✅ Proper APP_KEY generated

---

## Deployment Checklist for Future Projects

- [ ] Verify Traefik config files mounted in `/etc/dokploy/docker-compose.yml`
- [ ] Test domain routing with `curl -H "Host: domain" http://127.0.0.1/`
- [ ] If using Cloudflare, disable HTTPS redirect in Dokploy Domains UI
- [ ] For Laravel: Ensure all config files present before deploying
- [ ] Generate proper APP_KEY: `php artisan key:generate`
- [ ] Run migrations: `php artisan migrate`
- [ ] Test API endpoints after deployment
- [ ] Check container logs for any remaining errors: `docker logs container-name`

---

## Files Changed During Resolution

### Deployment/Infrastructure
- `/etc/dokploy/docker-compose.yml` — Added Traefik volume mounts
- `docker-compose.production.yml` — Removed `redirect-to-https@file` middleware from labels

### Laravel Application
- `app/Http/Controllers/ActivityController.php` — Fixed syntax error (line 198)
- `config/view.php` — Created (was missing)
- `config/cache.php` — Created (was missing)
- `config/session.php` — Created (was missing)
- `config/logging.php` — Created (was missing)
- `config/filesystems.php` — Created (was missing)
- `.env` — Updated APP_KEY and SESSION_DRIVER
