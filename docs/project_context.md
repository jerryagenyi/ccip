---
project_name: 'ccip'
user_name: 'Jerry'
date: '2025-12-14'
sections_completed: ['technology_stack']
existing_patterns_found: 15
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Frontend
- **Framework**: Vue 3.4.21 (Composition API only)
- **UI Library**: Quasar 2.14.2
- **Language**: TypeScript (strict mode enabled)
- **State Management**: Pinia 2.1.7
- **Routing**: Vue Router 4.3.0
- **HTTP Client**: Axios 1.6.7
- **Build Tool**: Vite 5.1.0
- **Testing**: Vitest 1.0.0 (unit), Playwright 1.40.0 (E2E)
- **Path Alias**: `@/` maps to `src/`

### Backend
- **Framework**: Laravel 10.10
- **Language**: PHP 8.2+
- **Database**: PostgreSQL 16+ (with JSONB and pgvector)
- **Authentication**: Laravel Sanctum 3.2
- **Permissions**: Spatie Laravel Permission 5.10
- **File Storage**: S3-compatible (MinIO for dev, AWS S3 for prod)
- **Caching**: Redis (via Predis 2.0)
- **Testing**: PHPUnit 10.x
- **Code Style**: Laravel Pint 1.0

### Infrastructure
- **Containerization**: Docker Compose
- **API Versioning**: All endpoints under `/api/v1`
- **PWA**: Enabled via Quasar PWA mode

## Critical Implementation Rules

_Documented after discovery phase_
