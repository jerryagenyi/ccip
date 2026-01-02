# Suggested Commands for CCIP Development

## Windows System Commands
```powershell
# File operations
dir              # List directory contents
cd <path>        # Change directory
mkdir <name>     # Create directory
del <file>       # Delete file
copy <src> <dst> # Copy file
move <src> <dst> # Move file

# Text search
findstr /s /i "pattern" *.php  # Search in files
select-string "pattern" *.ts   # PowerShell search

# Git
git status
git add .
git commit -m "message"
git push
git pull
git checkout -b <branch>
```

## Backend Commands (Laravel 10)
```bash
cd backend

# Setup
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Development
php artisan serve              # Start dev server (port 8000)
php artisan tinker             # Interactive REPL

# Code Quality
php artisan pint               # Format code with Laravel Pint (PSR-12)

# Testing
php artisan test               # Run all tests
php artisan test --filter <test_name>

# Database
php artisan migrate:fresh --seed
php artisan db:seed
```

## Frontend Commands (Vue 3 + Quasar)
```bash
cd frontend

# Setup
npm install

# Development
npm run dev                    # Start dev server (port 5173)

# Linting & Formatting
npm run lint                   # ESLint check + auto-fix
npm run lint:check             # ESLint check only (no fix)
npm run format                 # Prettier format
npm run format:check           # Prettier check only

# Build
npm run build                  # Build for production

# Testing - Unit
npm run test                   # Vitest unit tests
npm run test:ui                # Vitest UI
npm run test:coverage          # Coverage report

# Testing - E2E (Playwright)
npm run test:e2e               # E2E tests (localhost)
npm run test:e2e:headed        # E2E with visible browser
npm run test:e2e:ui            # E2E UI mode
npm run test:e2e:debug         # E2E debug mode
npm run test:e2e:codegen       # Playwright code generator

# Testing - Production (optional)
npm run test:e2e:prod          # Tests against live deployment
npm run test:e2e:prod:headed   # E2E tests with visible browser (production)

# Playwright Setup
npm run playwright:install     # Install Playwright browsers
npm run playwright:install:deps # Install system dependencies
npm run playwright:report      # View HTML test report
```

## Docker Commands
```bash
# Start services
docker-compose up              # Start all services
docker-compose up backend      # Start only Laravel API (port 8000)
docker-compose up frontend     # Start only Vue frontend (port 5173)

# Stop services
docker-compose down

# Other useful commands
docker-compose ps              # Show running containers
docker-compose logs -f         # Follow logs
docker-compose exec backend sh # Open shell in backend container
```

## Task Completion Checklist
After implementing any feature:
1. **Backend**: `php artisan pint` (format code)
2. **Frontend**: `npm run lint` and `npm run format`
3. **Testing**: `php artisan test` and `npm run test`
4. **Build**: `npm run build` (for frontend)
5. **Commit**: Create meaningful commit message
