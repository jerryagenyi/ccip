---
project_name: 'ccip'
user_name: 'Jerry'
date: '2025-12-14'
sections_completed:
  ['technology_stack', 'language_specific_rules', 'framework_specific_rules', 'testing_rules', 'code_quality_style_rules', 'development_workflow_rules', 'critical_dont_miss_rules']
status: 'complete'
rule_count: 150+
optimized_for_llm: true
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

### Code Quality & Style Rules

#### Code Organization

**Frontend Structure:**
- Pages: `src/pages/` — route components (one per route)
- Components: `src/components/` — reusable components, organized by feature (`components/activities/`, `components/ui/`)
- Stores: `src/stores/` — Pinia stores, one per domain (`useActivityStore.ts`)
- Composables: `src/composables/` — reusable composition functions (`usePDFExport.ts`)
- Services: `src/services/` — API client and external service wrappers
- Types: `src/types/` — TypeScript type definitions
- Layouts: `src/layouts/` — layout components (`MainLayout.vue`, `AuthLayout.vue`)
- Components should be under 300 lines — split into smaller components if larger
- Use barrel exports (`index.ts`) sparingly — prefer explicit imports
- Keep test files co-located or in `__tests__` directories

**Backend Structure:**
- Controllers: `app/Http/Controllers/` — API controllers, use `Controller` base class
- Models: `app/Models/` — Eloquent models, one per database table
- Services: `app/Services/` — business logic services
- Requests: `app/Http/Requests/` — Form Request validation classes
- Resources: `app/Http/Resources/` — API Resource transformers
- Middleware: `app/Http/Middleware/` — custom middleware
- Migrations: `database/migrations/` — database schema changes
- Use query scopes instead of repeating query logic
- Group related exports together

#### Naming Conventions

**Frontend:**
- Components: PascalCase (`ActivityList.vue`, `BaseButton.vue`)
- Stores: camelCase with `use` prefix (`useActivityStore.ts`)
- Composables: camelCase with `use` prefix (`usePDFExport.ts`)
- Files: kebab-case for pages, PascalCase for components
- Variables: camelCase (`const activityList = ref([])`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

**Backend:**
- Classes: PascalCase (`ActivityController`, `ActivityService`)
- Methods: camelCase (`createActivity()`, `getActivities()`)
- Variables: camelCase (`$activities`, `$user`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Database tables: snake_case plural (`activities`, `user_organisations`)

#### Code Style

**TypeScript/Vue:**
- Use single quotes for strings: `'text'` not `"text"`
- Use trailing commas in multi-line objects/arrays
- Use 2 spaces for indentation
- Max line length: 100 characters (soft limit)
- Use semicolons consistently
- Always use `defineProps` and `defineEmits` with TypeScript interfaces, never inline props
- Use `computed` for derived state, not methods
- Use `watchEffect` sparingly — prefer explicit `watch` with dependencies

**PHP/Laravel:**
- Use Laravel Pint for code formatting (PSR-12 standard)
- Use single quotes for strings when possible
- Use type hints for all method parameters and return types
- Use `return` type hints on all methods
- Use `readonly` properties where appropriate
- Prefer `match()` over `switch` for simple value matching
- Use short array syntax: `[]` not `array()`
- Use strict comparison: `===` not `==`

#### Code Quality Principles
- Single responsibility — components/services should do one thing
- Use dependency injection consistently
- Avoid circular dependencies
- Keep functions small — max 50 lines, extract to helpers if longer
- Use query scopes instead of repeating query logic

#### Documentation

**Comments:**
- Use JSDoc comments for TypeScript functions: `/** Description */`
- JSDoc should include `@param` and `@returns` for all exported functions
- Use PHPDoc comments for PHP methods: `/** Description */`
- PHPDoc should include `@param`, `@return`, and `@throws` where applicable
- Use `@see` for related methods
- Comment complex logic, not obvious code
- Use `// TODO:` for temporary workarounds
- Use `// FIXME:` for known bugs
- Use `// NOTE:` for important context
- Remove commented-out code before committing
- Keep comments up-to-date with code changes
- Document complex business logic, not just function signatures

**README/Docs:**
- Update `CLAUDE.md` when adding new patterns
- Document API changes in `docs/api/`
- Keep architecture docs in `docs/architecture/` up-to-date

### Development Workflow Rules

#### Git/Repository Rules

**Branch Naming:**
- Feature branches: `feature/XXX-description` (e.g., `feature/001-user-auth`)
- Bug fixes: `fix/XXX-description` (e.g., `fix/login-error`)
- Epic branches: `epic/XXX-feature-name` (e.g., `epic/001-user-organisation-management`)
- Use SpecKit epic numbers (001, 002, etc.) in branch names when applicable
- Never commit directly to `main` or `develop` branches — always use feature branches

**Commit Message Format:**
- Format: `type(scope): description [task-id]`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Scope: epic number or feature name (e.g., `feat(001): add user registration`)
- Description: imperative mood, lowercase, no period
- Include task ID when implementing SpecKit tasks: `[task-1.1]`
- Examples:
  - `feat(001): add user registration endpoint [task-1.1]`
  - `fix(002): correct activity status validation [task-2.3]`
  - `test(003): add dashboard analytics tests [task-3.2]`

**PR Requirements:**
- Link to SpecKit epic/spec in PR description
- Include acceptance criteria checklist
- Include test coverage report
- Link to related issues/epics
- Ensure all tests pass before requesting review
- Ensure CI passes before requesting review
- Update documentation if API/architecture changes
- Request review from relevant team members
- Use draft PRs for work-in-progress
- Create PRs even for small fixes

#### Development Workflow

**SpecKit-Driven Development:**
- All features follow Epic → Spec → Plan → Tasks → Implementation workflow
- Epic specifications in `docs/epics/epic-XXX-feature-name.md`
- User stories in `docs/stories/US-XXX-story-name.md`
- Always check relevant specs before implementation
- Follow task order in `tasks.md` — no skipping or reordering
- Mark tasks complete only when implementation AND tests are done
- Update `tasks.md` as you complete tasks — mark `[x]` when done
- Follow red-green-refactor cycle: write failing test first, then implementation
- All tests must pass before marking task complete
- Update `IMPLEMENTATION_PLAN.md` if scope changes

**Local Development:**
- Use Docker Compose for local development: `docker-compose up`
- Backend: `cd backend && php artisan serve` (port 8000)
- Frontend: `cd frontend && npm run dev` (port 5173)
- Run full test suite before pushing: `npm run test && php artisan test`
- Use `git pull --rebase` before pushing to avoid merge commits
- Run `php artisan pint` before committing PHP code
- Run `npm run lint` (if configured) before committing frontend code

**Code Review:**
- All code must be reviewed before merging
- Reviewers check: tests, documentation, code style, architecture alignment
- Address review comments before merging

**Documentation Updates:**
- Update architecture docs when adding new patterns or services
- Document breaking API changes in `docs/api/CHANGELOG.md`
- Update `CLAUDE.md` when adding new patterns

**Deployment:**
- Use semantic versioning for releases: `v1.0.0`, `v1.1.0`, etc.
- Tag releases with version numbers
- Update `CHANGELOG.md` for each release
- Test in staging before production

### Critical Don't-Miss Rules

#### Anti-Patterns to Avoid

**Frontend:**
- Don't use Options API — Composition API only
- Don't use `any` type — use proper types or `unknown`
- Don't mutate Pinia state outside stores — use actions
- Don't use `v-html` without sanitization — security risk
- Don't create components over 300 lines — split them
- Don't use relative imports (`../../components/`) — use `@/` alias
- Don't forget to handle loading and error states in async operations
- Don't use `watchEffect` without understanding dependencies — prefer explicit `watch`

**Backend:**
- Don't use `$guarded = []` — always use `$fillable` array
- Don't return raw models from controllers — use API Resources
- Don't use inline validation in controllers — use Form Requests
- Don't use raw SQL queries — use Eloquent query builder
- Don't forget to use `SoftDeletes` trait where appropriate
- Don't skip type hints in method signatures
- Don't create endpoints outside `/api/v1/` — versioning requirement
- Don't forget to handle exceptions — use try/catch or Laravel's exception handling

#### Edge Cases to Handle

**Frontend:**
- Handle empty states in lists/tables
- Handle network errors gracefully with user-friendly messages
- Handle offline mode (PWA) — show appropriate UI
- Handle form validation errors from API responses
- Handle pagination edge cases — empty results, single page, last page
- Handle loading states during async operations
- Handle race conditions in async actions (use AbortController if needed)

**Backend:**
- Handle soft-deleted records in queries — use `withTrashed()` if needed
- Handle pagination edge cases — empty results, invalid page numbers
- Handle file upload validation — size, type, security
- Handle concurrent updates — use database transactions where needed
- Handle missing relationships gracefully — check `exists()` before accessing
- Handle JSON field validation — ensure valid JSON structure
- Handle timezone issues — use UTC for storage, convert for display

#### Security Rules

**Frontend:**
- Never expose API keys or secrets in client code
- Sanitize user input before displaying (prevent XSS)
- Validate input on client side, but always validate on server too
- Use HTTPS for all API calls
- Store tokens securely — use httpOnly cookies or secure localStorage

**Backend:**
- Always validate and sanitize user input
- Use parameterized queries (Eloquent handles this)
- Never expose sensitive data in error messages
- Use Laravel Sanctum for authentication — don't roll your own
- Use Spatie permissions for authorization — check permissions in middleware
- Hash passwords — never store plain text
- Use CSRF protection for state-changing operations
- Validate file uploads — check type, size, scan for malware
- Use rate limiting on API endpoints
- Log security events — failed logins, permission denials

#### Performance Gotchas

**Frontend:**
- Avoid N+1 queries — use eager loading (`with()`)
- Don't render large lists without virtualization
- Use `v-show` instead of `v-if` for frequently toggled elements
- Debounce search inputs to avoid excessive API calls
- Use `computed` for expensive calculations, not methods
- Lazy load routes and components
- Optimize images — use appropriate formats and sizes

**Backend:**
- Avoid N+1 queries — use `with()` for eager loading
- Use database indexes for frequently queried columns
- Cache expensive queries — use Redis for caching
- Use pagination for large datasets — never return all records
- Use database transactions for multi-step operations
- Avoid loading unnecessary relationships
- Use query scopes to avoid repeating query logic
- Use `select()` to limit columns when you don't need all fields

#### Critical Project-Specific Rules
- Always check epic and story files before implementation — `docs/epics/epic-XXX-feature-name.md` and `docs/stories/US-XXX-story-name.md`
- Follow task order in `tasks.md` — no skipping or reordering
- All endpoints must be under `/api/v1/` — no exceptions
- Use API Resources for all responses — never return raw models
- Test offline functionality — PWA must work offline
- Low-bandwidth optimization required — minimize payload sizes
- No mapping/GIS features in MVP — explicitly excluded
- Role-based security strictly enforced — check permissions at API level

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

*Last Updated: 2025-12-14*
