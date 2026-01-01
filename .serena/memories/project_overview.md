# CCIP - Crisis Communication Intelligence Platform

## Project Purpose
A public health crisis management platform designed for low-bandwidth environments in African health contexts. Enables crisis communication, activity tracking, and hierarchical organization management.

## Tech Stack

### Backend
- **Framework**: Laravel 10
- **Database**: PostgreSQL with soft deletes
- **Authentication**: Laravel Sanctum (token-based)
- **File Storage**: S3-compatible (MinIO)
- **Permissions**: Spatie Laravel Permission package
- **API Versioning**: All endpoints under `/api/v1`
- **AI Integration**: OpenAI API with graceful fallback

### Frontend
- **Framework**: Vue 3 + Quasar (PWA capabilities)
- **State Management**: Pinia stores
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Testing**: Vitest (unit) + Playwright (E2E)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Caching**: Redis
- **Development Environment**: Local Docker setup

## Key Architectural Concepts

### 1. BMAD Method Development
All features follow Epic → Story → Implementation workflow:
- Epic specifications: `docs/epics/epic-XXX-feature-name.md`
- User stories: `docs/stories/US-XXX-story-name.md`
- Sprint status: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Always check relevant epics and stories before implementation

### 2. Hierarchical Organization System
- Multi-level role-based access: Super Admin → Admin → Sub-admin → User
- Organizations can be linked and transferred
- Users can have different roles across organizations

### 3. Global Platform Design
- No country-specific code
- Location stored as JSON
- Generic administrative levels (national, regional, district, local, community)

## Project Structure

### Backend Key Directories
- `app/Http/Controllers/API/` - API controllers
- `app/Http/Controllers/Controller.php` - Base controller with standardized response methods
- `app/Models/` - Eloquent models with relationships
- `database/migrations/` - Database schema
- `app/Services/` - Business logic services

### Frontend Key Directories
- `src/pages/` - Route components
- `src/components/` - Reusable components
- `src/stores/` - Pinia stores
- `src/composables/` - Vue composables

## Core Entities
- **Users** - with roles and organization assignments
- **Organizations** - with hierarchical structure
- **Activities** - workflow states (submit → approve/reject → complete)
- **Messages** - for internal communication
- **Reports** - analytics and export
- **Files** - S3 storage integration

## Key Constraints
- No mapping/GIS features in MVP
- Low-bandwidth optimization required
- Offline functionality through PWA
- Role-based security strictly enforced

## Important Documentation Files
- Product Requirements: `_bmad-output/planning-artifacts/prd.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Project Context: `docs/project_context.md`
- Implementation Plan: `IMPLEMENTATION_PLAN.md`
