# Docker Restart Policies

## Overview

All services in `docker-compose.yml` are configured with `restart: unless-stopped` policy.

## What This Means

**`restart: unless-stopped`**:
- ✅ Automatically restarts containers if they crash
- ✅ Automatically starts containers when Docker starts (e.g., after reboot)
- ✅ Respects manual stops (`docker-compose stop` or `docker stop`)
- ✅ Won't restart if you explicitly stop a container

## Is This Bad Practice?

**For Development: ✅ Good Practice**
- Keeps your dev environment running
- Auto-recovers from crashes
- Convenient for daily development

**For Production: ⚠️ Consider Alternatives**
- Production typically uses orchestration (Kubernetes, Docker Swarm)
- Or process managers (systemd, supervisor)
- More control over restart behavior
- Better monitoring and alerting

## Restart Policy Options

| Policy | Behavior | Use Case |
|--------|----------|----------|
| `no` | Never restart | Testing, one-off tasks |
| `always` | Always restart (even if manually stopped) | Can be annoying in dev |
| `on-failure` | Restart only on failure | Production (with limits) |
| `unless-stopped` | Restart unless manually stopped | **Development (recommended)** |

## Current Configuration

All services use `restart: unless-stopped`:
- `postgres` - Database
- `minio` - File storage
- `redis` - Cache/queue
- `backend` - Laravel API
- `frontend` - Vue/Quasar app

## Manual Control

**Stop a service (won't auto-restart):**
```bash
docker-compose stop frontend
```

**Start a service:**
```bash
docker-compose start frontend
```

**Restart a service:**
```bash
docker-compose restart frontend
```

**Remove restart policy temporarily:**
```bash
docker-compose up --no-restart frontend
```

## Benefits for Development

1. **Auto-recovery**: If a service crashes, it restarts automatically
2. **Boot persistence**: After rebooting your machine, services start automatically
3. **Convenience**: No need to manually start services every time
4. **Respects manual control**: You can still stop services when needed

## Monitoring

Check container status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f frontend
```

Check restart count:
```bash
docker inspect ccip_frontend | grep -A 5 RestartCount
```

