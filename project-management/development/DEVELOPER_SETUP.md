# Complete Developer Setup Guide

## 📋 Overview

This guide provides a comprehensive setup for CCIP development, covering IDE configuration, debugging, testing, and workflow optimization.

## 🔧 Prerequisites

### Required Software
- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Git** version 2.30+
- **VS Code** or **Cursor** (recommended)
- **Node.js** 18+ (for local frontend development if needed)
- **PHP** 8.2+ (for local backend development if needed)

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 20GB free space
- **Processor**: 4+ cores recommended

## 🚀 Initial Setup

### 1. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/your-org/ccip.git
cd ccip

# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Verify Docker is running
docker --version
docker-compose --version
```

### 2. Start Development Environment

```bash
# Start all services
docker-compose up -d

# Wait for services to be healthy (30-60 seconds)
docker-compose ps

# Setup backend
docker-compose exec backend composer install
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate:fresh --seed
docker-compose exec backend php artisan storage:link

# Setup frontend
docker-compose exec frontend npm install
```

### 3. Verify Setup

```bash
# Check all services are running
docker-compose ps

# Test backend API
curl http://localhost:8000/api/health

# Test frontend
curl http://localhost:5173

# Access services
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# MinIO Console: http://localhost:9001
```

## 💻 IDE Configuration

### VS Code Setup

Install these extensions:

```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bmewburn.vscode-intelephense-client",
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "ms-vscode-remote.remote-containers",
    "ms-azuretools.vscode-docker",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.php": true
  },
  "php.validate.executablePath": "/usr/local/bin/php",
  "intelephense.environment.phpVersion": "8.2",
  "volar.completion.autoImportComponent": true,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "files.associations": {
    "*.blade.php": "blade",
    "*.env*": "dotenv"
  }
}
```

#### VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Environment",
      "type": "shell",
      "command": "docker-compose up -d",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Run Backend Tests",
      "type": "shell",
      "command": "docker-compose exec backend php artisan test",
      "group": "test"
    },
    {
      "label": "Run Frontend Tests",
      "type": "shell",
      "command": "docker-compose exec frontend npm run test",
      "group": "test"
    },
    {
      "label": "Fresh Database Migrate",
      "type": "shell",
      "command": "docker-compose exec backend php artisan migrate:fresh --seed",
      "group": "build"
    }
  ]
}
```

### Cursor Setup

If using Cursor with AI assistance:

1. Install the same VS Code extensions above
2. Load the [AI Assistant Prompt](../.cursor/rules/AI_ASSISTANT_PROMPT.md)
3. Configure AI to follow SpecKit methodology

## 🐛 Debugging Configuration

### Backend Debugging (Xdebug)

Add to `docker-compose.yml` in the backend service:

```yaml
backend:
  # ... existing config
  environment:
    XDEBUG_MODE: develop,debug
    XDEBUG_CONFIG: client_host=host.docker.internal
  volumes:
    - ./backend:/var/www/html
    - ./docker/xdebug.ini:/usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
```

Create `docker/xdebug.ini`:

```ini
[xdebug]
xdebug.mode = develop,debug
xdebug.client_host = host.docker.internal
xdebug.start_with_request = yes
xdebug.log = /var/log/xdebug.log
```

VS Code launch configuration (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/var/www/html": "${workspaceFolder}/backend"
      }
    }
  ]
}
```

### Frontend Debugging

VS Code launch configuration for Vue:

```json
{
  "name": "Launch Vue App",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/frontend/src"
}
```

## 🧪 Testing Setup

### Backend Testing

```bash
# Run all tests
docker-compose exec backend php artisan test

# Run specific test
docker-compose exec backend php artisan test tests/Feature/ActivityTest.php

# Run with coverage
docker-compose exec backend php artisan test --coverage

# Watch mode (local development)
docker-compose exec backend php artisan test --watch
```

### Frontend Testing

```bash
# Install testing dependencies
docker-compose exec frontend npm install -D vitest @vue/test-utils

# Run tests
docker-compose exec frontend npm run test

# Run tests in watch mode
docker-compose exec frontend npm run test:watch

# Run tests with coverage
docker-compose exec frontend npm run test:coverage
```

### E2E Testing with Cypress

```bash
# Install Cypress
docker-compose exec frontend npm install -D cypress

# Open Cypress
docker-compose exec frontend npm run cypress:open

# Run headlessly
docker-compose exec frontend npm run cypress:run
```

## 🔄 Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start services (if not running)
docker-compose up -d

# 3. Install any new dependencies
docker-compose exec backend composer install
docker-compose exec frontend npm install

# 4. Run any pending migrations
docker-compose exec backend php artisan migrate

# 5. Start development
# Backend changes appear automatically
# Frontend hot reloads automatically
```

### Creating New Features

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Read SpecKit Documentation**
```bash
# Read the relevant Epic spec
cat specs/epic-XXX-feature-name.md

# Check implementation plan
cat IMPLEMENTATION_PLAN.md
```

3. **Implementation**
```bash
# Make changes
# Test frequently
docker-compose exec backend php artisan test
docker-compose exec frontend npm run test

# Commit changes
git add .
git commit -m "feat(component): add new feature"
```

4. **Code Quality Checks**
```bash
# Backend formatting
docker-compose exec backend vendor/bin/pint

# Frontend linting
docker-compose exec frontend npm run lint

# Type checking (if using TypeScript)
docker-compose exec frontend npm run type-check
```

## 🛠️ Useful Commands

### Docker Commands

```bash
# View logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart backend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Clear containers
docker-compose down

# Clear everything (including volumes)
docker-compose down -v

# Rebuild containers
docker-compose build --no-cache
```

### Laravel Commands

```bash
# Create new controller
docker-compose exec backend php artisan make:controller ActivityController

# Create new model with migration
docker-compose exec backend php artisan make:model Activity -m

# Create new seeder
docker-compose exec backend php artisan make:seeder ActivitySeeder

# Clear caches
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# View routes
docker-compose exec backend php artisan route:list

# Create API documentation
docker-compose exec backend php artisan api:generate
```

### Vue Commands

```bash
# Create new component
docker-compose exec frontend npm run quasar new component ActivityForm

# Create new page
docker-compose exec frontend npm run quasar new page activities/create

# Create new store (Pinia)
# Manually create in frontend/src/stores/

# Build for production
docker-compose exec frontend npm run build

# Run PWA build
docker-compose exec frontend npm run build:pwa
```

## 📊 Performance Monitoring

### Backend Performance

```bash
# View slow queries
docker-compose exec postgres psql -U ccip_user ccip -c "
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
"

# Monitor Laravel performance
docker-compose exec backend php artisan route:list --compact
docker-compose exec backend php artisan model:show Activity
```

### Frontend Performance

```bash
# Bundle analyzer
docker-compose exec frontend npm run build:analyze

# Lighthouse CI
docker-compose exec frontend npm run lighthouse
```

## 🔍 Troubleshooting

### Common Issues

**"Docker container exits immediately"**
```bash
# Check logs
docker-compose logs backend

# Common fix: Missing permissions or port conflicts
```

**"Database connection failed"**
```bash
# Check if PostgreSQL is healthy
docker-compose ps postgres

# Restart services
docker-compose restart postgres backend
```

**"Frontend not compiling"**
```bash
# Clear node_modules and reinstall
docker-compose exec frontend rm -rf node_modules package-lock.json
docker-compose exec frontend npm install
```

**"Permission denied errors"**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Performance Issues

**Slow development server**
```bash
# Increase Docker memory limits in Docker Desktop
# Use .dockerignore to exclude unnecessary files
```

**Large Docker images**
```bash
# Use .dockerignore files
# Run docker system prune -a
```

## 📚 Learning Resources

### Laravel Resources
- [Laravel Documentation](https://laravel.com/docs/)
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)

### Vue Resources
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Quasar Framework](https://quasar.dev/)

### Docker Resources
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🤝 Getting Help

1. **Check logs**: `docker-compose logs [service]`
2. **Read documentation**: Check `docs/` folder
3. **Search issues**: [GitHub Issues](https://github.com/your-org/ccip/issues)
4. **Ask questions**: [GitHub Discussions](https://github.com/your-org/ccip/discussions)

---

Happy coding! Your contributions help public health officials save lives. 🏥💙