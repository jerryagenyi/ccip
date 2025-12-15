---
project_name: 'ccip'
user_name: 'Jerry'
date: '2025-12-14'
sections_completed: ['technology_stack', 'language_specific_rules', 'framework_specific_rules', 'testing_rules']
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

### Framework-Specific Rules

#### Vue 3 + Quasar
- **Composition API only** — no Options API
- Use `<script setup lang="ts">` syntax for all components
- Define props with TypeScript interfaces: `interface Props { ... }`
- Use `defineProps<Props>()` and `defineEmits<Emits>()`
- Composables use `export function useXxx()` pattern
- Pinia stores use `defineStore` with Composition API syntax (setup function style)
- Use Quasar components (`q-btn`, `q-card`, `q-input`) instead of custom HTML
- Wrap Quasar components in base components (`BaseButton.vue`, `BaseCard.vue`) for consistency
- Use Quasar's built-in props (`color`, `size`, `variant`) rather than custom CSS classes
- Follow Quasar's responsive breakpoints (`xs`, `sm`, `md`, `lg`, `xl`)
- Pinia stores in `src/stores/` — one store per domain (`useActivityStore`, `useUserStore`)
- Stores use Composition API: `defineStore('name', () => { ... })`
- Use `ref()` for reactive state, `computed()` for derived state
- Actions are async functions, not methods
- Never mutate state directly outside the store
- Routes defined in `src/router/routes.ts`
- Use route guards in `src/router/guards.ts` for authentication
- Use `useRouter()` and `useRoute()` composables, not `this.$router`

#### Laravel
- Controllers in `app/Http/Controllers/` — use `Controller` base class
- API controllers return JSON responses using `$this->paginated()` or `$this->success()`
- Use Form Request classes (`LoginRequest`) for validation, not inline validation
- Keep controllers thin — move business logic to Services
- Services in `app/Services/` — encapsulate business logic
- Services are plain PHP classes, not extending anything
- Use dependency injection in constructors
- Return domain objects or arrays, not HTTP responses
- Models use `HasFactory` and `SoftDeletes` traits where appropriate
- Always define `$fillable` array — never use `$guarded = []`
- Use `$casts` for JSON/array fields: `'metadata' => 'array'`
- Define relationships: `belongsTo()`, `hasMany()`, `belongsToMany()`
- Use Eloquent query builder, avoid raw SQL
- Use API Resources (`ActivityResource`) for all API responses
- Resources transform models to JSON structure
- Never return raw models from controllers
- Authentication via `auth:sanctum` middleware
- Use Spatie permissions middleware for RBAC
- Custom middleware in `app/Http/Middleware/`

### Testing Rules

#### Frontend Testing (Vitest + Playwright)
- Unit tests: `tests/unit/` — test components, stores, composables in isolation
- E2E tests: `tests/e2e/` — test full user workflows with Playwright
- Test files: `*.spec.ts` or `*.test.ts` naming convention
- Setup file: `tests/setup.ts` for global test configuration
- Use `describe` blocks to group related tests
- Use `beforeEach` for test setup, clean up after tests
- Environment: `jsdom` for component testing
- Path alias `@/` works in tests (configured in `vitest.config.ts`)
- Coverage provider: `v8` with text, json, html reporters
- Exclude: `node_modules/`, `tests/`, config files, dist files
- Use `@vue/test-utils` for component testing
- Test component props, emits, slots, and user interactions
- Mock Quasar components if needed: `vi.mock('quasar')`
- Test composables independently, not through components
- Use `vi.fn()` for mocks (Vitest, not Jest)
- Pinia store tests use `createTestingPinia()` helper
- Test Pinia stores in isolation with `setActivePinia(createPinia())`
- Test state changes, computed properties, and async actions
- Mock API calls: `vi.mock('@/services/api')`
- Test async operations properly — use `await` for async actions
- Test critical user flows: login, activity creation, navigation
- Use data-testid attributes for reliable selectors
- Test offline functionality (PWA features)
- Test responsive behavior across breakpoints
- Use page object pattern for complex Playwright flows
- Test accessibility (a11y) with `@axe-core/playwright`

#### Backend Testing (PHPUnit)
- Feature tests: `tests/Feature/` — test API endpoints and workflows
- Unit tests: `tests/Unit/` — test models, services, utilities
- Test files: `*Test.php` naming convention
- Use `RefreshDatabase` trait for feature tests that need actual DB state
- Use factories for test data: `Activity::factory()->create()`
- Test authentication: `$this->actingAs($user)`
- Test authorization: verify role-based access control
- Test validation: submit invalid data, verify error responses
- Test pagination: verify paginated responses structure
- Use `assertDatabaseHas()` and `assertDatabaseMissing()` for data verification
- Test queue jobs separately from controllers
- Test file uploads properly — mock S3/MinIO in tests
- Test soft deletes — verify `deleted_at` is set, not actual deletion
- Test relationships — verify eager loading works with `->with()`
- Avoid N+1 queries in tests — verify eager loading
- Test pagination edge cases — empty results, single page, last page
- Test all HTTP methods: GET, POST, PUT, DELETE
- Test status codes: 200, 201, 400, 401, 403, 404, 422
- Test response structure: verify JSON structure matches API Resources
- Test error handling: verify error messages and codes
- Test API contracts — verify API Resources transform data correctly
- Test middleware chains — authentication, authorization, rate limiting
- Test error responses match API spec

#### General Testing Rules
- Write tests before implementation (TDD) or alongside code
- Test error paths, not just happy paths
- Mock external services (AI service, S3, email)
- Keep tests fast — use factories, not database seeding
- One assertion per test concept, but multiple assertions per test are fine
- Test names describe what is being tested: `test_user_can_create_activity()`
