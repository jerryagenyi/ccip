---
project_name: 'ccip'
user_name: 'Jerry'
date: '2025-12-14'
sections_completed: ['technology_stack', 'language_specific_rules']
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

### Language-Specific Rules

#### TypeScript/JavaScript
- **Strict mode enabled** — all code must be fully typed
- `noUnusedLocals: true` — remove unused variables
- `noUnusedParameters: true` — remove unused function parameters
- **BAN `any` type** — use `unknown` or proper types instead
- Use `const` assertions for literal types: `as const`
- Prefer `interface` over `type` for object shapes
- Always type function return values explicitly
- Path alias `@/` maps to `src/` — use `@/components/` not relative paths
- Use ES6 `import/export` syntax (no `require()`)
- Type imports: `import type { Activity } from '@/types'`
- Vue composables return reactive refs/computed, not plain values
- Pinia stores use `defineStore` with Composition API syntax only

#### PHP/Laravel
- Always use type hints in method signatures: `public function createActivity(array $data): Activity`
- Use Form Requests for validation (`LoginRequest`, not inline `$request->validate()`)
- Prefer Eloquent relationships over manual joins
- Always use `$fillable` array, never `$guarded = []`
- Use `SoftDeletes` trait where appropriate
- Cast JSON fields: `protected $casts = ['metadata' => 'array']`
- Use API Resources (`ActivityResource`) for all responses, never return raw models
- All endpoints under `/api/v1/` — no exceptions
- PSR-4 autoloading: namespace matches directory structure
