# CCIP Documentation Index

**Project:** Crisis Communication Intelligence Platform (CCIP)  
**Last Updated:** 2025-01-XX  
**Documentation Version:** 1.0

## Overview

CCIP is a multi-part application for public health crisis communication management, designed for low-bandwidth environments and African health contexts. This documentation provides comprehensive information about the architecture, development, and usage of the platform.

## Quick Links

- [Getting Started](getting-started/index.md) - Setup and installation
- [Architecture Overview](architecture/overview.md) - System architecture
- [Development Guide](development-guide.md) - Development workflows
- [API Contracts](api-contracts-backend.md) - Backend API documentation
- [Data Models](data-models-backend.md) - Database schema
- [Component Inventory](component-inventory-frontend.md) - Frontend components

## Documentation Structure

### 1. Getting Started

**For New Developers:**
- [Getting Started Guide](getting-started/index.md) - Initial setup and installation
- [Development Guide](development-guide.md) - Development workflows and best practices

### 2. Architecture

**System Design:**
- [Architecture Overview](architecture/overview.md) - Complete system architecture
- [Integration Architecture](integration-architecture.md) - Frontend-backend integration
- [Source Tree Analysis](source-tree-analysis.md) - Project structure and organization

### 3. Backend Documentation

**API & Data:**
- [API Contracts](api-contracts-backend.md) - Complete API endpoint documentation (62+ endpoints)
- [Data Models](data-models-backend.md) - Database schema and Eloquent models

**Backend Resources:**
- Backend README: `backend/README.md`
- Laravel Documentation: https://laravel.com/docs

### 4. Frontend Documentation

**Components & State:**
- [Component Inventory](component-inventory-frontend.md) - All Vue components (46+ components)
- Frontend README: `frontend/README.md`
- Vue 3 Documentation: https://vuejs.org/
- Quasar Documentation: https://quasar.dev/

### 5. Development

**Workflows:**
- [Development Guide](development-guide.md) - Development setup, workflows, testing
- [CLAUDE.md](../CLAUDE.md) - AI assistant instructions for this repository

**BMAD Method:**
- Epic specifications: `docs/epics/`
- User stories: `docs/stories/`
- Sprint status: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### 6. Reference Documentation

**From Firebase Prototype:**
- [UX Design Specification](../firebase-prototype/docs/UX_DESIGN_SPECIFICATION.md) - UI/UX design guide
- [Migration Guide](../firebase-prototype/docs/MIGRATION_GUIDE.md) - Next.js → Vue/Quasar migration
- [Backend Schema](../firebase-prototype/docs/backend.json) - Entity schemas
- [PostgreSQL Schema](../firebase-prototype/docs/schema.sql) - Database schema reference

## Technology Stack

### Frontend
- **Framework:** Vue 3.5 (Composition API)
- **UI Library:** Quasar 2.18
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7.1
- **State Management:** Pinia (13 stores)
- **Routing:** Vue Router 4
- **HTTP Client:** Axios
- **Testing:** Vitest (unit), Playwright (E2E)
- **PWA:** Offline-first architecture

### Backend
- **Framework:** Laravel 11
- **Language:** PHP 8.2
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Storage:** S3-compatible (MinIO/AWS S3)
- **Authentication:** Laravel Sanctum
- **Testing:** PHPUnit

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx
- **CI/CD:** GitHub Actions + Dokploy

## Project Structure

```
ccip/
├── backend/              # Laravel 11 API
├── frontend/            # Vue 3 + Quasar PWA
├── firebase-prototype/  # Next.js prototype (reference)
├── docs/                # This documentation
├── _bmad-output/        # BMAD workflow artifacts
└── docker-compose.yml   # Development environment
```

## Key Features

1. **Multi-Tier Organization Management**
   - Hierarchical organisation structure
   - Role-based access control (Super Admin → Admin → Sub-admin → User)

2. **Activity Planning & Management**
   - Full CRUD operations
   - Status workflow (draft → submitted → approved → completed)
   - File attachments
   - Location targeting

3. **AI-Powered Semiotic Analysis**
   - Risk assessment for communication messages
   - Cultural context evaluation
   - Recommendations and suggestions

4. **Internal Communication**
   - Messaging system
   - Notifications
   - Announcements

5. **Analytics & Reporting**
   - Activity analytics
   - Engagement metrics
   - AI-generated reports
   - Export (PDF, Excel, CSV)

6. **Offline Support**
   - PWA with service worker
   - Offline storage and sync
   - Low-bandwidth optimization

## API Overview

**Base URL:** `/api/v1`  
**Authentication:** Bearer Token (Laravel Sanctum)  
**Total Endpoints:** 62+

**Main Endpoint Groups:**
- Authentication (`/auth/*`)
- Users (`/users/*`)
- Activities (`/activities/*`)
- Organisations (`/organisations/*`)
- Messages (`/messages/*`)
- Reports (`/reports/*`)
- Analytics (`/analytics/*`)
- AI (`/ai/*`)
- Notifications (`/notifications/*`)
- Help (`/help/*`)
- Uploads (`/uploads/*`)

See [API Contracts](api-contracts-backend.md) for complete documentation.

## Database Overview

**Database:** PostgreSQL 16  
**Total Tables:** 20+

**Core Tables:**
- `users` - User accounts
- `organisations` - Organisations (hierarchical)
- `activities` - Activities/campaigns
- `messages` - Internal messages
- `notifications` - User notifications
- `reports` - Generated reports
- `semiotic_patterns` - AI pattern database

See [Data Models](data-models-backend.md) for complete schema.

## Component Overview

**Total Components:** 46+ Vue components

**Component Categories:**
- Base UI Components (12) - Wrapped Quasar components
- Activity Components (3) - Activity-specific features
- Layout Components (3) - Page layouts
- Report Components (1) - Report generation
- Page Components (20+) - Route pages

**State Management:**
- 13 Pinia stores for domain state
- Centralized API client
- Type-safe TypeScript interfaces

See [Component Inventory](component-inventory-frontend.md) for complete list.

## Development Workflow

1. **Setup Environment**
   ```bash
   docker-compose up -d
   ```

2. **Check Epic/Story**
   - Review relevant epic in `docs/epics/`
   - Review user story in `docs/stories/`

3. **Implement Feature**
   - Follow development guide
   - Write tests
   - Update documentation

4. **Test & Review**
   - Run unit tests
   - Run E2E tests
   - Code review

5. **Deploy**
   - Push to main branch
   - Dokploy auto-deploys

See [Development Guide](development-guide.md) for detailed workflows.

## Testing

### Backend
- **Framework:** PHPUnit
- **Location:** `backend/tests/`
- **Run:** `php artisan test`

### Frontend
- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **Location:** `frontend/tests/`
- **Run:** `npm run test` (unit), `npm run test:e2e` (E2E)

## Deployment

**Production URLs:**
- Frontend: https://ccip.jerryagenyi.xyz
- Backend: https://ccip-api.jerryagenyi.xyz/api/v1

**Deployment Method:**
- GitHub Actions (monitoring)
- Dokploy (auto-deploy from Docker Compose)
- Zero-downtime deployments

## Contributing

1. Follow BMAD Method workflow (Epic → Story → Implementation)
2. Check existing documentation before asking questions
3. Write tests for new features
4. Update documentation as needed
5. Follow code style guidelines (PSR-12, ESLint, Prettier)

## Support & Resources

**Documentation:**
- This index and all linked documents
- Inline code comments
- README files in each part

**External Resources:**
- [Laravel Documentation](https://laravel.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Quasar Documentation](https://quasar.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

**BMAD Framework:**
- BMAD rules: `_bmad/`
- Workflow artifacts: `_bmad-output/`

## Document Status

**Generated:** 2025-01-XX  
**Scan Type:** Exhaustive  
**Coverage:**
- ✅ Architecture documentation
- ✅ API contracts (62+ endpoints)
- ✅ Data models (20+ tables)
- ✅ Component inventory (46+ components)
- ✅ Source tree analysis
- ✅ Development guide
- ✅ Integration architecture
- ✅ Firebase prototype documentation extracted

**Last Updated:** See individual document headers

---

**Note:** This documentation was generated using the BMAD `document-project` workflow with exhaustive scan. For updates, run the workflow again or manually update individual documents.

