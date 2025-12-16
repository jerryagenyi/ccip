# Getting Started with CCIP

Welcome to the CCIP (Crisis Communication Intelligence Platform) development guide.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm
- **PHP** 8.2+ and Composer
- **PostgreSQL** 16+
- **Redis** 7+
- **Docker** and Docker Compose (recommended)

## Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ccip.git
   cd ccip
   ```

2. **Start services with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Run migrations**
   ```bash
   cd backend
   php artisan migrate
   php artisan db:seed
   ```

5. **Start development servers**
   ```bash
   # Backend (terminal 1)
   cd backend
   php artisan serve

   # Frontend (terminal 2)
   cd frontend
   npm run dev
   ```

## Next Steps

- [Development Environment Setup](prerequisites.md)
- [Installation Guide](installation.md)
- [First Steps](first-steps.md)
- [Architecture Overview](../architecture/overview.md)

## Need Help?

- Check our [troubleshooting guide](../reference/troubleshooting.md)
- Review the [FAQ](../reference/faq.md)
- Contact the development team