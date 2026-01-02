# Code Style and Conventions - CCIP

## Backend (Laravel 10 - PHP)

### Code Style Standard
- **PSR-12** - Extended coding style for PHP
- Enforced by **Laravel Pint** (`php artisan pint`)

### Naming Conventions
- **Classes**: PascalCase (e.g., `UserController`, `UserService`)
- **Methods**: camelCase (e.g., `getUserById`, `createActivity`)
- **Variables**: camelCase (e.g., `$userId`, `$activityData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`, `DEFAULT_ROLE`)

### File Organization
- **Controllers**: `app/Http/Controllers/API/` - suffix with `Controller`
- **Models**: `app/Models/` - singular, PascalCase
- **Services**: `app/Services/` - business logic layer
- **Migrations**: `database/migrations/` - timestamped naming

### API Response Standards
All API controllers extend `App\Http\Controllers\Controller` which provides:
- `success($data, $message, $code)` - Standardized success responses
- `error($message, $code, $errors)` - Standardized error responses
- `paginated($data, $message)` - Standardized paginated responses

**Example**:
```php
return $this->success($user, 'User retrieved successfully', 200);
return $this->error('Validation failed', 422, $errors);
```

### Service Patterns
- Services handle business logic
- Graceful error handling with fallbacks
- Example: `AIService` falls back to mock data when OpenAI API fails

### Model Conventions
- Use soft deletes (`Illuminate\Database\Eloquent\SoftDeletes`)
- Define relationships explicitly
- Use `$fillable` for mass assignment protection
- Use `$casts` for type casting

## Frontend (Vue 3 + Quasar - TypeScript)

### Code Style Standards
- **ESLint** for TypeScript/Vue linting
- **Prettier** for code formatting
- Run: `npm run lint` and `npm run format`

### Naming Conventions
- **Components**: PascalCase with .vue extension (e.g., `UserProfile.vue`)
- **Composables**: camelCase with 'use' prefix (e.g., `useAuth.ts`, `usePDFExport.ts`)
- **Stores**: camelCase with 'use' prefix + 'Store' suffix (e.g., `useAuthStore.ts`)
- **Types**: camelCase (e.g., `interface User { }`)

### File Organization
- **Pages**: `src/pages/` - route components
- **Components**: `src/components/` - reusable components
- **Stores**: `src/stores/` - Pinia stores
- **Composables**: `src/composables/` - Vue composables
- **Types**: `src/types/` - TypeScript type definitions
- **Services**: `src/services/` - API services, utilities

### Vue 3 Composition API
- Use `<script setup lang="ts">` syntax
- Import composables and stores from `src/`
- Define reactive state with `ref()` and `reactive()`

### TypeScript Conventions
- Use interfaces for type definitions
- Type API responses in `src/types/api.ts`
- Export types from `src/types/index.ts`

### Pinia Store Conventions
- Define state with type safety
- Use actions for mutations
- Export typed store hook

## General Principles

### Error Handling
- **Backend**: Graceful degradation (e.g., AIService fallback)
- **Frontend**: User-friendly error messages
- **API**: Standardized error response format

### Security
- Role-based access control (Spatie Laravel Permission)
- Input validation on both frontend and backend
- SQL injection prevention (Eloquent ORM)
- XSS prevention (Vue template escaping)

### Performance
- Low-bandwidth optimization (critical for target environment)
- Lazy loading where appropriate
- Efficient database queries (eager loading relationships)
- Code splitting in frontend builds

### Documentation
- Epic specifications before implementation
- User stories for features
- Code comments for complex logic
- API documentation in `docs/api/`
