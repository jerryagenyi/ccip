# CCIP Documentation Index

## Project Overview

- **Type:** Multi-part with 2 parts
- **Primary Language:** TypeScript (Frontend), PHP (Backend)
- **Architecture:** Vue 3 + Quasar Frontend + Laravel RESTful API Backend

## Quick Reference

### Frontend Part (web)
- **Tech Stack:** Vue 3.4.21 + Quasar 2.14.2 + TypeScript
- **Entry Point:** frontend/src/main.ts
- **Architecture Pattern:** Component-based with Pinia state management
- **Dev Server:** http://localhost:5173

### Backend Part (backend)
- **Tech Stack:** Laravel 10.10 + PHP 8.2 + PostgreSQL
- **Entry Point:** backend/public/index.php
- **Architecture Pattern:** Layered (Controller → Service → Repository)
- **Dev Server:** http://localhost:8000

## Generated Documentation

### Core Documentation
- [Project Overview](./project-overview.md) _(To be generated)_
- [Architecture - Frontend](./architecture-frontend.md)
- [Architecture - Backend](./architecture-backend.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md) _(To be generated)_
- [Development Guide](./development-guide.md) _(To be generated)_

### API Documentation
- [API Contracts - Backend](./api-contracts-backend.md) _(To be generated)_

### Data Models
- [Data Models - Backend](./data-models-backend.md) _(To be generated)_

### Integration
- [Integration Architecture](./integration-architecture.md) _(To be generated)_

### Existing Documentation

### Technical Documentation
- [README](./README.md) - Main technical documentation
- [Technical Architecture](./technical/architecture/technical_architecture_document.md) - Detailed system architecture
- [Architecture Analysis](./technical/architecture/ARCHITECTURE_ANALYSIS.md) - Architecture patterns and analysis
- [Technical Specification v2.0](./technical/architecture/technical_specification_v2.0.md) - Current technical specs

### API Documentation
- [CCIP API Endpoint Specification](./technical/api/CCIP_API_ENDPOINT_SPECIFICATION.md) - Complete API reference

### Implementation
- [Implementation Plan](./technical/implementation/IMPLEMENTATION_PLAN.md) - Technical implementation details
- [Project Structure](./technical/implementation/PROJECT_STRUCTURE.md) - Code organization
- [Backend Status Consolidated](./technical/implementation/backend/STATUS_CONSOLIDATED.md) - Implementation status

### Migration & Deployment
- [Migration Assessment](./technical/migration/MIGRATION_ASSESSMENT_AND_PLAN.md) - Migration planning
- [Migration Checklist](./technical/migration/MIGRATION_CHECKLIST.md) - Migration tasks
- [Integration Checklist](./technical/migration/INTEGRATION_CHECKLIST.md) - Integration verification

### Development
- [Contributing Guide](./development/CONTRIBUTING.md) - How to contribute
- [Developer Setup](./development/DEVELOPER_SETUP.md) - Development environment setup
- [Docker Practices](./development/DOCKER_PRACTICES.md) - Docker best practices
- [AI Implementation Guidelines](./development/AI_IMPLEMENTATION_GUIDELINES_FOR_MVP.md) - AI integration guide

### Planning
- [Requirements Specification](./planning/REQUIREMENTS_SPECIFICATION.md) - Complete functional requirements
- [Requirements Checklist](./planning/REQUIREMENTS_CHECKLIST.md) - Requirements verification
- [Development Readiness Assessment](./planning/DEVELOPMENT_READINESS_ASSESSMENT.md) - Readiness evaluation
- [Wiki Integration Assessment](./planning/WIKI_INTEGRATION_ASSESSMENT.md) - Wiki integration analysis

### Testing
- [Complete Verification Report](./testing/COMPLETE_VERIFICATION_REPORT.md) - Comprehensive testing report
- [Auth Testing Summary](./testing/AUTH_TESTING_SUMMARY.md) - Authentication testing
- [Implementation Readiness Summary](./testing/IMPLEMENTATION_READINESS_SUMMARY.md) - Current status

### Getting Started

### Prerequisites
- Node.js 18+ for frontend development
- PHP 8.2+ for backend development
- PostgreSQL 15 for database
- Redis for caching and queues
- Docker & Docker Compose (optional but recommended)

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ccip.git
cd ccip

# Setup Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

# Setup Frontend (new terminal)
cd frontend
npm install
npm run dev

# Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
```

### Development Workflow

1. **Frontend Development**: Run `npm run dev` in frontend directory
2. **Backend Development**: Run `php artisan serve` in backend directory
3. **Database**: Migrations and seeds managed via Laravel Artisan
4. **Testing**: Run tests with `npm test` (frontend) and `php artisan test` (backend)
5. **Building**: Use `npm run build` for production frontend build

### Key Integration Points

- **API Communication**: Frontend axios client configured at `frontend/src/boot/axios.ts`
- **Authentication**: Laravel Sanctum tokens managed in Pinia stores
- **Real-time Features**: WebSocket connections for live updates
- **File Uploads**: Handled through Laravel's file storage system

### Troubleshooting

- **Frontend not loading**: Check if backend API is running on port 8000
- **Authentication errors**: Verify CORS configuration in backend
- **Database errors**: Ensure PostgreSQL is running and credentials are correct
- **Permission errors**: Check Laravel Sanctum configuration

## BMM Workflow Status

This documentation was generated as part of the BMM (BMad Method) workflow. For tracking progress:

- **Workflow Status**: [bmm-workflow-status.yaml](./bmm-workflow-status.yaml)
- **Next Required**: [PRD Workflow](#) (create Product Requirements Document)
- **Discovery**: Brainstorm and Research workflows completed

---

*Last updated: 2025-12-11*
*Generated by: BMM Document Project Workflow*