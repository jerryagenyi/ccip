# CCIP AI Assistant Development Prompt

## Project Context

You are working on **CCIP** (Risk Communication Activity Platform), a purpose-built platform for tracking, reporting, and analyzing public health risk communication activities. This is an MVP focused strictly on activity tracking, role-based management, secure evidence uploads, and internal communications—optimized for low-bandwidth African and global contexts.

**IMPORTANT**: Mapping and social media infodemiology modules are **FUTURE EXPANSION ONLY**. Do not implement, suggest, or code these features under any circumstances. They should remain documented in the roadmap only.

## Core Principles

1. **MVP Discipline**: Stay within the defined MVP scope. Any feature outside the 5 epics must be documented in the roadmap, not implemented.
2. **SpecKit-Driven Development**: All work must follow the SpecKit methodology (Epic → Spec → Plan → Tasks).
3. **Public Health Domain**: All business logic, terminology, and user flows must reflect public health risk communication contexts.
4. **Low-Bandwidth First**: Every implementation decision must consider connectivity constraints.
5. **Role-Based Security**: All features must enforce the hierarchical permission model.

## Technology Stack

- Frontend: Vue 3 + Quasar + Pinia (PWA-optimized)
- Backend: Laravel 10+ with PHP 8.2+
- Database: PostgreSQL 15+
- Storage: S3-compatible (MinIO for dev, AWS S3 for prod)
- Infrastructure: Docker Compose
- Documentation: SpecKit markdown format

## Current Project Status

### ✅ Completed
- Project management documents (PRD, technical spec, architectural roadmap)
- Docker Compose configuration with all services
- 5 Epic specifications with user stories and technical requirements
- Implementation plan with 8 phases
- Basic project structure and .gitignore

### 🔄 Next Immediate Tasks
1. Initialize Laravel backend in `/backend` directory
2. Initialize Vue 3 + Quasar frontend in `/frontend` directory
3. Set up database migrations for Epic 001 (User & Organisation Management)
4. Implement Laravel Sanctum authentication
5. Create Vue components for login/register

## Critical Rules

### DO NOT
- Implement mapping, geospatial features, or GIS functionality
- Add social media monitoring, scraping, or analysis
- Implement AI/ML pipelines for sentiment analysis
- Suggest or use external APIs for social data
- Add features beyond the 5 defined epics
- Use expensive or bandwidth-heavy libraries

### MUST DO
- Reference the latest `IMPLEMENTATION_PLAN.md` before implementing
- Check the relevant Epic spec in `/specs/` before coding
- Document all business logic with inline comments
- Use SpecKit format for new feature documentation
- Prioritize low-bandwidth optimization
- Implement role-based permissions at API and UI levels

## Development Workflow (SpecKit)

CCIP uses **SpecKit-driven development**. Follow this workflow:

1. **READ CONSTITUTION**: Always check `memory/constitution.md` first
2. **READ SPEC**: Review `specs/XXX-feature-name/spec.md` for user stories
3. **READ PLAN**: Check `specs/XXX-feature-name/plan.md` for implementation approach
4. **READ TASKS**: Review `specs/XXX-feature-name/tasks.md` for task breakdown
5. **IMPLEMENT**: Follow task order, respecting dependencies
6. **DOCUMENT**: Add inline comments explaining business logic
7. **UPDATE**: Update SpecKit documents if scope changes

### SpecKit Commands (if CLI installed)
- `/speckit.plan` - Generate implementation plan from spec
- `/speckit.tasks` - Generate task breakdown from plan
- `/speckit.implement` - Execute implementation tasks

## Epic Structure (Current MVP)

### Epic 001: User & Organisation Management
- Multi-tier roles: Super Admin → Admin → Sub-admin → User
- Hierarchical organisations with parent-child relationships
- Self-service profile management
- JWT authentication via Laravel Sanctum

### Epic 002: Activity Tracking & Reporting
- Activity CRUD with audit trails
- Evidence uploads (images, docs, audio, video)
- Customizable reporting templates
- Timeline and status tracking

### Epic 003: Dashboards & Analytics
- Role-based dashboard views
- Activity heatmaps and status tracking
- Export functionality for leadership reports
- Engagement metrics

### Epic 004: Communication System
- Internal messaging between org levels
- Notification system for urgent updates
- Real-time updates (start with polling)

### Epic 005: Documentation & Help
- API documentation via Swagger/OpenAPI
- User help guides per role
- Onboarding tours
- Contextual help tooltips

## Code Style & Standards

### Backend (Laravel)
- Follow PSR-12 coding standards
- Use form requests for validation
- Implement proper error handling with custom exceptions
- Use resource classes for API responses
- Add PHPDoc blocks for all methods

### Frontend (Vue/Quasar)
- Use Composition API primarily
- Implement proper TypeScript types (optional but recommended)
- Use Pinia for state management
- Follow Quasar component patterns
- Add JSDoc comments for business logic

### Security Requirements
- All endpoints must be authenticated except `/auth/login` and `/auth/register`
- Role-based middleware for all sensitive operations
- Input validation and sanitisation
- File upload restrictions and virus scanning
- SQL injection prevention (use Eloquent)

## File Organization

```
ccip/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Http/Requests/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── tests/
├── frontend/               # Vue 3 + Quasar
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── services/
│   └── quasar.config.js
├── specs/                  # SpecKit feature specifications
│   └── XXX-feature-name/
│       ├── spec.md         # Feature specification
│       ├── plan.md         # Implementation plan
│       ├── tasks.md        # Task breakdown
│       ├── data-model.md   # Database schema
│       └── contracts/      # API contracts
├── memory/                 # Project constitution
│   └── constitution.md     # Core principles and constraints
├── templates/              # SpecKit templates
├── scripts/                # Helper scripts
├── project-management/     # PRD, technical docs
└── IMPLEMENTATION_PLAN.md  # Current phase tracking
```

## Testing Requirements

- Backend: Feature tests for all API endpoints
- Frontend: Component tests for critical user flows
- Integration: API integration tests
- Security: Authentication and authorization tests
- Performance: Load testing for file uploads

## Deployment Context

- Development: Docker Compose with MinIO
- Production: AWS/Azure with S3 storage
- Monitoring: Application logs and health checks
- Backup: Daily database backups

## Communication Style

When responding or suggesting code:
1. Reference the specific Epic and User Story you're addressing
2. Explain how your implementation serves public health officials
3. Consider bandwidth implications
4. Document any assumptions or limitations
5. Suggest testing strategies

## Quick Reference Commands

```bash
# Start all services
docker-compose up -d

# Backend development
cd backend && composer install && php artisan serve

# Frontend development
cd frontend && npm install && npm run dev

# Database migrations
cd backend && php artisan migrate

# Run tests
cd backend && php artisan test
cd frontend && npm run test
```

## Example Task Execution

**Task**: Implement user registration

**Before Coding**:
1. Read `/specs/epic-001-user-organisation-management.md`
2. Check `IMPLEMENTATION_PLAN.md` Phase 2 tasks
3. Review technical spec for authentication requirements

**Implementation**:
1. Create `RegisterRequest` form validation
2. Implement `AuthController@register` method
3. Add email verification
4. Create Vue registration component
5. Add Pinia auth store actions
6. Test complete flow

**Documentation**:
1. Add inline comments explaining public health context
2. Update API routes if needed
3. Document any decisions in the Epic spec

---

**Remember**: You are building a tool for public health officials who need to track risk communication activities in bandwidth-constrained environments. Every line of code should serve this mission.