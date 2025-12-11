# Docker Best Practices for CCIP

## 📋 Overview

This document explains CCIP's Docker setup, volume management, and data handling practices. Understanding these practices prevents common issues with database corruption, data loss, and team collaboration problems.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   CCIP Stack                         │
├─────────────┬─────────────┬─────────────┬───────────┤
│  Frontend   │   Backend   │  Database   │  Storage  │
│  (Vue/      │   (Laravel  │ (PostgreSQL)│  (MinIO)  │
│   Quasar)   │    API)     │             │           │
└─────────────┴─────────────┴─────────────┴───────────┘
```

### Services Explained

| Service | Technology | Purpose | Data Persistence |
|---------|------------|---------|------------------|
| `postgres` | PostgreSQL 15 | Relational database | **Docker Volume** |
| `minio` | MinIO | Object storage (files) | **Docker Volume** |
| `redis` | Redis 7 | Caching/queues | **Docker Volume** |
| `backend` | Laravel | API server | Code (mounted) + **Vendor Volume** |
| `frontend` | Vue 3 + Quasar | Web interface | Code (mounted) + **Node Modules Volume** |

## 🔀 Volumes: What They Are and Why We Use Them

### Docker Volumes vs Bind Mounts

**Docker Volume (Managed by Docker):**
```yaml
volumes:
  postgres_data:  # Docker manages this data
```
- ✅ Docker handles permissions
- ✅ Works across all operating systems
- ✅ Better performance
- ❌ Data lives outside project folder

**Bind Mount (Folder from Your Computer):**
```yaml
volumes:
  - ./my-data:/data  # Your computer's folder
```
- ✅ Data visible in project folder
- ✅ Easy to access and backup
- ❌ Permission issues on Windows/Mac
- ❌ Should NOT be committed to Git

## 📁 CCIP Volume Strategy

### Production Data (NEVER in Git)
```yaml
# These contain runtime data that changes during use
volumes:
  postgres_data:    # User accounts, activities, reports
  minio_data:       # Uploaded files, images, documents
  redis_data:       # Cache, sessions, queues
```

### Development Dependencies (NEVER in Git)
```yaml
# These speed up development but are generated
volumes:
  backend_vendor:   # PHP packages
  frontend_node_modules:  # NPM packages
```

### Source Code (ALWAYS in Git)
```yaml
# These are your actual code changes
volumes:
  - ./backend:/var/www/html      # Your PHP code
  - ./frontend:/app              # Your Vue code
```

## 🚫 Critical Rules: Never Commit These to Git

### ❌ Docker Volumes
```
# NEVER add these to Git
docker-data/
backups/
uploads/
storage/
```

### ❌ Generated Files
```
# NEVER add these to Git
node_modules/
vendor/
.env
*.sqlite
*.log
```

### ✅ Always in Git
```
# These SHOULD be in Git
docker-compose.yml
Dockerfile
package.json
composer.json
database/migrations/
database/seeders/
```

## 👥 Team Collaboration

### New Developer Onboarding

```bash
# 1. Clone repository (no volume data)
git clone https://github.com/your-org/ccip.git
cd ccip

# 2. Start services (creates fresh volumes)
docker-compose up -d

# 3. Seed database with consistent test data
docker-compose exec backend php artisan migrate:fresh --seed

# Result: Everyone gets same structure + same sample data
```

### Sharing Database Changes

**❌ WRONG: Share database file**
```bash
# DON'T DO THIS
git add postgres_data/
git commit -m "Updated database"
```

**✅ RIGHT: Share migrations and seeders**
```bash
# DO THIS
# 1. Create migration
docker-compose exec backend php artisan make:migration add_new_table

# 2. Edit migration file
# 3. Commit migration
git add database/migrations/2024_01_15_add_new_table.php
git commit -m "Add new table for health metrics"

# 4. Other developers run
docker-compose exec backend php artisan migrate
```

## 🔧 Common Docker Tasks

### View Volume Data
```bash
# See all volumes
docker volume ls

# Inspect specific volume
docker volume inspect ccip_postgres_data

# Browse volume contents
docker run --rm -v ccip_postgres_data:/data alpine ls /data
```

### Backup Database
```bash
# Export database to SQL file
docker-compose exec postgres pg_dump -U ccip_user ccip > backup.sql

# Restore database from SQL file
docker-compose exec -T postgres psql -U ccip_user ccip < backup.sql
```

### Reset Development Environment
```bash
# Stop and remove volumes (FRESH START)
docker-compose down -v

# Restart with fresh volumes
docker-compose up -d

# Seed with sample data
docker-compose exec backend php artisan migrate:fresh --seed
```

### Clear Caches
```bash
# Clear Laravel cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

## 🐛 Troubleshooting Volume Issues

### "Permission Denied" Errors

**On Linux:**
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER .
sudo usermod -aG docker $USER
```

**On Windows/Mac:**
- Use Docker Desktop (not Docker Toolbox)
- Ensure file sharing is enabled in Docker settings

### "Database Connection Failed"

```bash
# Check if PostgreSQL is healthy
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### "Out of Disk Space"

```bash
# Clean up unused Docker resources
docker system prune -a

# View volume sizes
docker system df -v

# Remove specific volume (CAUTION: deletes data)
docker volume rm ccip_postgres_data
```

## 🚀 Production Considerations

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Volumes | Docker-managed | Backup strategy needed |
| Environment | `.env` file | Environment variables |
| Performance | Not optimized | Resource limits needed |
| Monitoring | Manual | Health checks required |

### Production Backup Strategy

```bash
# Daily database backup
0 2 * * * docker-compose exec postgres pg_dump -U ccip_user ccip > /backups/ccip_$(date +\%Y\%m\%d).sql

# Weekly MinIO backup
0 3 * * 0 docker exec ccip_minio mc mirror /data /backups/minio_$(date +\%Y\%m\%d)
```

### Production Recovery

```bash
# Restore database
docker-compose exec -T postgres psql -U ccip_user ccip < backup_20240115.sql

# Restore files
docker exec ccip_minio mc mirror /backups/minio_20240115 /data
```

## 📚 Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Get running in 15 minutes
- [Developer Setup](./DEVELOPER_SETUP.md) - Complete development environment
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

---

💡 **Remember**: Docker volumes are for runtime data, Git is for source code. Never mix them!