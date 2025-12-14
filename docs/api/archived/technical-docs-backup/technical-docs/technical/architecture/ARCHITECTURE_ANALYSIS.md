# CCIP Application Architecture & File Structure Analysis

**Purpose**: Comprehensive analysis of the existing Vue.js, Quasar, and Laravel application architecture to facilitate migration planning from React/Next.js prototype.

**Date**: January 2025

---

## 1. Overall Architecture

### Architecture Pattern
**Separate Vue SPA with Laravel API Backend**

The application follows a **decoupled architecture** where:
- **Frontend**: Vue 3 + Quasar SPA running independently (typically on port 5173)
- **Backend**: Laravel RESTful API (typically on port 8000)
- **Communication**: Frontend communicates with backend via HTTP REST API using Axios
- **Deployment**: Both services are containerised using Docker Compose, but can be deployed separately

### Authentication Method
**JWT (JSON Web Tokens) via Laravel Sanctum**

- Authentication uses **Laravel Sanctum** for token-based authentication
- Tokens are stored in `localStorage` on the frontend
- Token is sent in `Authorization: Bearer {token}` header with each API request
- Token refresh mechanism is implemented in the auth store
- API base URL: `http://localhost:8000/api/v1` (configurable via `VITE_API_URL`)

### Infrastructure Stack
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis 7
- **File Storage**: MinIO (S3-compatible) for development, AWS S3 for production
- **Containerisation**: Docker Compose for local development

---

## 2. Laravel Backend Structure

**Note**: The Laravel backend code is not yet fully implemented. The structure below is based on the planned architecture, API contracts, and documentation. The backend directory currently contains only `Dockerfile` and `README.md`.

### Expected Backend Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── OrganisationController.php
│   │   │   ├── ActivityController.php
│   │   │   └── ...
│   │   ├── Middleware/
│   │   │   ├── RoleMiddleware.php
│   │   │   └── ...
│   │   └── Requests/
│   │       ├── LoginRequest.php
│   │       ├── RegisterRequest.php
│   │       └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Organisation.php
│   │   ├── Role.php
│   │   └── ...
│   └── Services/
│       └── (Service classes for business logic)
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_organisations_table.php
│   │   ├── 0001_01_01_000002_create_roles_table.php
│   │   └── ...
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── RoleSeeder.php
│       └── ...
└── routes/
    └── api.php
```

### API Routes (Expected Structure)

Based on the API contracts, routes should be structured as follows:

**File**: `routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrganisationController;

// API version prefix: /api/v1

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);
        
        // User routes
        Route::get('/users/me', [UserController::class, 'me']);
        Route::put('/users/me', [UserController::class, 'update']);
        
        // Organisation routes (admin only)
        Route::middleware('role:super_admin,admin')->group(function () {
            Route::get('/organisations', [OrganisationController::class, 'index']);
            Route::post('/organisations', [OrganisationController::class, 'create']);
            Route::get('/organisations/{id}', [OrganisationController::class, 'show']);
            Route::put('/organisations/{id}', [OrganisationController::class, 'update']);
            Route::get('/organisations/{id}/users', [OrganisationController::class, 'users']);
        });
        
        // Activity routes
        Route::get('/activities', [ActivityController::class, 'index']);
        Route::post('/activities', [ActivityController::class, 'store']);
        Route::get('/activities/{id}', [ActivityController::class, 'show']);
        Route::put('/activities/{id}', [ActivityController::class, 'update']);
        Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);
        Route::post('/activities/{id}/submit', [ActivityController::class, 'submit']);
    });
});
```

**Route Protection**:
- `auth:sanctum` middleware protects authenticated routes
- Custom `role` middleware enforces role-based access (e.g., `role:super_admin,admin`)

### Example Controller (Expected Structure)

**File**: `app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'organisation_id' => $request->organisation_id,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('organisation'),
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('organisation'),
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
```

**Key Patterns**:
- Uses **Form Request classes** for validation (`LoginRequest`, `RegisterRequest`)
- Returns **JSON responses** with consistent structure
- Uses **Laravel Sanctum** for token management (`createToken()`, `currentAccessToken()`)
- Loads relationships using Eloquent's `load()` method

### Example Model (Expected Structure)

**File**: `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'organisation_id',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withPivot('assigned_by', 'assigned_at')
                    ->withTimestamps();
    }
}
```

### Example Migration (Expected Structure)

**File**: `database/migrations/0001_01_01_000000_create_users_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('name');
            $table->enum('role', ['super_admin', 'admin', 'sub_admin', 'user'])
                  ->default('user');
            $table->foreignId('organisation_id')->nullable()->constrained('organisations')->nullOnDelete();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('profile_picture')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
            $table->index('organisation_id');
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### Services/Repositories Pattern

Based on the architecture documentation, the application may use **Service classes** for business logic separation. Example structure:

**File**: `app/Services/OrganisationService.php`

```php
<?php

namespace App\Services;

use App\Models\Organisation;
use Illuminate\Support\Collection;

class OrganisationService
{
    /**
     * Get organisation hierarchy
     */
    public function getHierarchy(?int $parentId = null): Collection
    {
        return Organisation::where('parent_id', $parentId)
            ->with('children')
            ->get();
    }

    /**
     * Validate organisation hierarchy
     */
    public function validateHierarchy(int $organisationId, ?int $parentId): bool
    {
        // Prevent circular references
        if ($parentId === $organisationId) {
            return false;
        }

        // Additional validation logic
        return true;
    }
}
```

---

## 3. Vue.js/Quasar Frontend Structure

### Project Structure

```
frontend/
├── src/
│   ├── app.scss                    # Global styles
│   ├── App.vue                     # Root component
│   ├── main.ts                     # Application entry point
│   ├── quasar-variables.sass       # Quasar theme variables
│   │
│   ├── boot/                       # Quasar boot files
│   │   ├── axios.ts                # Axios configuration
│   │   └── router.ts                # Router boot file
│   │
│   ├── components/                 # Reusable Vue components
│   │   └── AppFooter.vue           # Footer component
│   │
│   ├── layouts/                    # Quasar layouts
│   │   ├── MainLayout.vue          # Main app layout (header, drawer, footer)
│   │   └── AuthLayout.vue          # Authentication layout
│   │
│   ├── pages/                      # Route pages (views)
│   │   ├── IndexPage.vue
│   │   ├── Dashboard.vue
│   │   ├── AuthLogin.vue
│   │   ├── AuthRegister.vue
│   │   ├── AuthForgotPassword.vue
│   │   ├── AuthResetPassword.vue
│   │   ├── UserProfile.vue
│   │   ├── ActivityList.vue
│   │   ├── ActivityCreate.vue
│   │   ├── ActivityDetail.vue
│   │   ├── ActivityTimeline.vue
│   │   ├── OrganisationList.vue
│   │   ├── OrganisationCreate.vue
│   │   ├── OrganisationDetail.vue
│   │   ├── MessageInbox.vue
│   │   ├── MessageCompose.vue
│   │   ├── MessageDetail.vue
│   │   ├── HelpSearch.vue
│   │   ├── HelpArticle.vue
│   │   └── ErrorNotFound.vue
│   │
│   ├── router/                     # Vue Router configuration
│   │   ├── index.ts                # Router instance
│   │   ├── routes.ts                # Route definitions
│   │   └── guards.ts                # Route guards (auth, role)
│   │
│   ├── services/                   # API service layer
│   │   └── api.ts                   # Axios instance with interceptors
│   │
│   └── stores/                     # Pinia stores (state management)
│       ├── useAuthStore.ts
│       ├── useUserStore.ts
│       ├── useOrganisationStore.ts
│       ├── useActivityStore.ts
│       ├── useDashboardStore.ts
│       ├── useMessageStore.ts
│       ├── useNotificationStore.ts
│       ├── useAnalyticsStore.ts
│       ├── useTemplateStore.ts
│       ├── useHelpStore.ts
│       └── useOnboardingStore.ts
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies
├── quasar.config.js                # Quasar configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

### State Management: Pinia

**Library**: Pinia (Vue 3's official state management)

**Example Store**: `src/stores/useAuthStore.ts`

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'sub_admin' | 'user';
  organisation?: {
    id: number;
    name: string;
  };
  profile_picture?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const userOrganisation = computed(() => user.value?.organisation || null);

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('auth_token', token.value);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('auth_token');
    }
  }

  async function fetchUser() {
    try {
      const response = await api.get('/users/me');
      user.value = response.data;
      return response.data;
    } catch (error) {
      token.value = null;
      user.value = null;
      localStorage.removeItem('auth_token');
      throw error;
    }
  }

  return {
    // State
    user,
    token,
    // Getters
    isAuthenticated,
    userRole,
    userOrganisation,
    // Actions
    login,
    logout,
    fetchUser,
  };
});
```

**Key Patterns**:
- Uses **Composition API** style (`defineStore` with setup function)
- State is defined using `ref()` and `computed()`
- Actions are async functions that call the API
- Token is persisted in `localStorage`
- TypeScript interfaces for type safety

### UI Components: Quasar Usage

**Example Component Using Quasar**: `src/pages/AuthLogin.vue`

```vue
<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
            outlined
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            outlined
          />
          <div>
            <q-btn type="submit" color="primary" label="Login" class="full-width" />
            <q-btn flat label="Forgot Password?" to="/auth/forgot-password" class="full-width q-mt-sm" />
            <q-btn flat label="Register" to="/auth/register" class="full-width" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push('/dashboard');
  } catch (error) {
    // Error handled by API interceptor
  } finally {
    loading.value = false;
  }
};
</script>
```

**Quasar Components Used**:
- `q-page`: Page container
- `q-card`: Card container
- `q-card-section`: Card sections
- `q-form`: Form wrapper with validation
- `q-input`: Text input with validation rules
- `q-btn`: Button component

### Custom Reusable Component

**Example**: `src/components/AppFooter.vue`

```vue
<template>
  <footer class="app-footer">
    <p class="footer-text">
      © {{ currentYear }}
      <template v-if="organisationName">
        {{ organisationName }} • Powered by CCIP v{{ appVersion }}
      </template>
      <template v-else>
        Powered by CCIP v{{ appVersion }}
      </template>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();

const currentYear = computed(() => new Date().getFullYear());
const organisationName = computed(() => {
  return authStore.userOrganisation?.name || null;
});
const appVersion = '1.0.0';
</script>

<style scoped>
.app-footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fafafa;
}
</style>
```

### Layouts

**Main Layout**: `src/layouts/MainLayout.vue`

```vue
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>CCIP</q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="notifications" />
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/activities">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Activities</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/messages">
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section>Messages</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-1">
      <AppFooter />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppFooter from '@/components/AppFooter.vue';

const leftDrawerOpen = ref(false);
</script>
```

**Layout Structure**:
- `q-layout`: Main layout wrapper with view configuration
- `q-header`: Top navigation bar
- `q-drawer`: Sidebar navigation drawer
- `q-page-container`: Container for router views
- `q-footer`: Footer section

### Routing

**Route Definitions**: `src/router/routes.ts`

```typescript
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
    ],
  },
  // Authentication routes
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'auth-login', component: () => import('pages/AuthLogin.vue') },
      { path: 'register', name: 'auth-register', component: () => import('pages/AuthRegister.vue') },
      { path: 'forgot-password', name: 'auth-forgot-password', component: () => import('pages/AuthForgotPassword.vue') },
      { path: 'reset-password', name: 'auth-reset-password', component: () => import('pages/AuthResetPassword.vue') },
    ],
  },
  // Protected routes
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/Dashboard.vue') },
    ],
  },
  {
    path: '/activities',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'activities-list', component: () => import('pages/ActivityList.vue') },
      { path: 'create', name: 'activities-create', component: () => import('pages/ActivityCreate.vue') },
      { path: ':id', name: 'activities-detail', component: () => import('pages/ActivityDetail.vue') },
    ],
  },
  {
    path: '/organisations',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin', 'admin'] },
    children: [
      { path: '', name: 'organisations-list', component: () => import('pages/OrganisationList.vue') },
      { path: 'create', name: 'organisations-create', component: () => import('pages/OrganisationCreate.vue') },
      { path: ':id', name: 'organisations-detail', component: () => import('pages/OrganisationDetail.vue') },
    ],
  },
  // 404 catch-all
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
```

**Route Guards**: `src/router/guards.ts`

```typescript
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'auth-login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

export function roleGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const requiredRoles = to.meta.requiresRole as string[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    if (!authStore.user || !requiredRoles.includes(authStore.user.role)) {
      next({ name: 'home' });
      return;
    }
  }

  next();
}
```

**Router Instance**: `src/router/index.ts`

```typescript
import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { authGuard, roleGuard } from './guards';

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  });

  // Apply route guards
  Router.beforeEach(authGuard);
  Router.beforeEach(roleGuard);

  return Router;
});
```

### API Communication

**Centralized API Service**: `src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Notify } from 'quasar';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
          break;

        case 403:
          Notify.create({
            type: 'negative',
            message: data.message || 'You do not have permission to perform this action',
          });
          break;

        case 422:
          // Validation error
          const errors = data.errors || {};
          const firstError = Object.values(errors)[0] as string[];
          Notify.create({
            type: 'negative',
            message: firstError?.[0] || data.message || 'Validation error',
          });
          break;

        case 500:
          Notify.create({
            type: 'negative',
            message: 'Server error. Please try again later.',
          });
          break;

        default:
          Notify.create({
            type: 'negative',
            message: data.message || 'An error occurred',
          });
      }
    } else if (error.request) {
      // Network error
      Notify.create({
        type: 'negative',
        message: 'Network error. Please check your connection.',
      });
    }

    return Promise.reject(error);
  }
);

export { api };
```

**Usage in Component**: Example from a store

```typescript
// In src/stores/useActivityStore.ts
import { api } from '@/services/api';

async function fetchActivities(filters?: {
  page?: number;
  status?: string;
  type?: string;
  organisation_id?: number;
}) {
  loading.value = true;
  try {
    const response = await api.get('/activities', { params: filters });
    activities.value = response.data.data || response.data;
    return response.data;
  } finally {
    loading.value = false;
  }
}
```

### Authentication Flow

**Login Page**: `src/pages/AuthLogin.vue` (shown above in UI Components section)

**Key Flow**:
1. User enters email and password
2. Form validation using Quasar's built-in `:rules` prop
3. On submit, calls `authStore.login()` with credentials
4. Store makes POST request to `/api/v1/auth/login`
5. On success, token is stored in `localStorage` and user object in Pinia store
6. Router redirects to `/dashboard`
7. On error, API interceptor shows notification via Quasar's `Notify`

---

## 4. Form Handling & Validation

### Validation Approach

The application uses **Quasar's built-in validation props** on form components, combined with custom validation rules.

### Example Form with Validation

**Example**: Login form (from `src/pages/AuthLogin.vue`)

```vue
<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="email"
      label="Email"
      type="email"
      :rules="[
        val => !!val || 'Email is required',
        val => /.+@.+\..+/.test(val) || 'Email must be valid'
      ]"
      outlined
      :error="emailError"
    />
    <q-input
      v-model="password"
      label="Password"
      type="password"
      :rules="[
        val => !!val || 'Password is required',
        val => val.length >= 8 || 'Password must be at least 8 characters'
      ]"
      outlined
    />
    <q-btn type="submit" color="primary" label="Login" class="full-width" :loading="loading" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const loading = ref(false);
const emailError = ref(false);

const onSubmit = async () => {
  // Quasar form validation runs automatically
  // If validation passes, this function executes
  loading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    // Server-side validation errors are handled by API interceptor
  } finally {
    loading.value = false;
  }
};
</script>
```

### Validation Patterns

1. **Client-side validation**: Using Quasar's `:rules` prop (array of functions)
2. **Server-side validation**: Errors returned from Laravel (422 status) are handled by the API interceptor
3. **Real-time validation**: Quasar validates on blur/change by default
4. **Custom rules**: Can be defined as functions that return `true` or an error message string

### Advanced Form Example (Expected)

For more complex forms, you might use:

```vue
<template>
  <q-form @submit="onSubmit" ref="formRef">
    <q-input
      v-model="formData.name"
      label="Name"
      :rules="[val => !!val || 'Name is required']"
      outlined
    />
    <q-select
      v-model="formData.type"
      :options="typeOptions"
      label="Type"
      :rules="[val => !!val || 'Type is required']"
      outlined
    />
    <q-btn type="submit" color="primary" label="Submit" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formRef = ref();
const formData = ref({
  name: '',
  type: null,
});

const typeOptions = ['option1', 'option2', 'option3'];

const onSubmit = async () => {
  // Manually trigger validation
  const valid = await formRef.value.validate();
  if (!valid) return;

  // Submit form
  // ...
};
</script>
```

---

## 5. Additional Technical Details

### Dependencies

**Frontend** (`package.json`):
```json
{
  "dependencies": {
    "@quasar/extras": "^1.16.9",
    "quasar": "^2.14.2",
    "vue": "^3.4.21",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7",
    "axios": "^1.6.7"
  },
  "devDependencies": {
    "@quasar/app-vite": "^1.4.0",
    "@vitejs/plugin-vue": "^5.0.4",
    "vite": "^5.1.0"
  }
}
```

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8000/api/v1
```

**Backend** (expected `.env`):
```
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=ccip
DB_USERNAME=ccip_user
DB_PASSWORD=ccip_password
```

### Build Configuration

**Quasar Config**: `quasar.config.js`
- Uses Vite as build tool
- Router mode: `history` (clean URLs)
- PWA support configured
- TypeScript support available

### Database Schema Summary

Based on `data-model.md`:
- **users**: Authentication and user data
- **organisations**: Hierarchical organisation structure
- **roles**: Role definitions with permissions
- **user_roles**: Pivot table for user-role assignments (audit trail)
- Additional tables for activities, messages, etc. (not detailed here)

---

## 6. Prototype-Specific Features & Migration Considerations

### Prototype Technology Stack (Source)
Based on the Firebase Studio prototype analysis:
- **Framework**: Next.js (React) with App Router
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI**: Custom React components with modern design system
- **Features**: Landing page, pricing tiers, contact forms, team directory, AI-powered reporting

### Key Features to Migrate

#### 6.1 Pricing & Subscription Management
**Prototype Feature**: Free and Premium tier pricing page with feature comparison

**Target Implementation**:
- **Frontend**: `src/pages/PricingPage.vue` using Quasar components
  - `q-card` for pricing tier cards
  - `q-table` for feature comparison table
  - `q-badge` for "Coming Soon" labels
  - Custom `ComingSoonBadge.vue` component
- **Backend**: Subscription management endpoints
  ```php
  // Expected Laravel routes
  GET /api/v1/pricing (public)
  GET /api/v1/organisations/{id}/subscription
  POST /api/v1/organisations/{id}/subscription/upgrade
  ```
- **Database**: `subscriptions` and `subscription_history` tables
- **State Management**: `useSubscriptionStore.ts` (Pinia)

#### 6.2 Team Directory & User Management
**Prototype Feature**: "Manage user roles, permissions, and invitations"

**Target Implementation**:
- **Frontend**: Already implemented in `src/pages/UserProfile.vue` and organisation pages
- **Backend**: User invitation system with role assignment
  ```php
  // Expected Laravel routes
  POST /api/v1/organisations/{id}/invitations
  GET /api/v1/invitations/{token}/accept
  POST /api/v1/users/{id}/roles
  ```
- **Components**: `q-select` for role selection, `q-chip` for role badges

#### 6.3 AI-Powered Reporting
**Prototype Feature**: "Generate insightful reports on trends and outcomes" (Coming Soon)

**Target Implementation**:
- **Frontend**: `src/pages/ReportsPage.vue` with "Coming Soon" badges
- **Backend**: Placeholder endpoints for future AI integration
  ```php
  // Future Laravel routes (when AI features are ready)
  POST /api/v1/reports/generate-ai
  GET /api/v1/analytics/ai-insights
  ```
- **State Management**: `useAnalyticsStore.ts` (already exists)
- **UI Pattern**: Use `q-badge` with "Coming Soon" styling for AI features

#### 6.4 Landing Page & Marketing Pages
**Prototype Feature**: Public-facing landing page with hero section, features, pricing, FAQ, contact form

**Target Implementation**:
- **Frontend**: Public routes without authentication
  ```typescript
  // In routes.ts
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'landing', component: () => import('pages/LandingPage.vue') },
      { path: 'pricing', name: 'pricing', component: () => import('pages/PricingPage.vue') },
      { path: 'contact', name: 'contact', component: () => import('pages/ContactPage.vue') },
    ],
  }
  ```
- **Components**: 
  - `q-hero` or custom hero section component
  - `q-card` for feature cards
  - `q-expansion-item` for FAQ accordion
  - `q-form` with `q-input` for contact form
- **Layout**: `src/layouts/PublicLayout.vue` (no auth required, different header/footer)

#### 6.5 Navigation Structure
**Prototype Pattern**: Top navigation bar with logo, links, and CTA button

**Target Implementation**:
- **Quasar Components**: 
  - `q-toolbar` for navigation bar
  - `q-btn` with gradient styling for "Get Started" CTA
  - `q-space` for spacing
  - `q-drawer` for mobile menu
- **Styling**: Custom CSS for gradient buttons (blue to purple)
- **Responsive**: Use Quasar's responsive utilities (`show-if-above`, `hide-on-mobile`)

### Component Mapping: Prototype → Quasar

| Prototype Element | Quasar Component | Notes |
|------------------|------------------|-------|
| Navigation Bar | `q-toolbar` + `q-toolbar-title` | Header with logo and links |
| Gradient Button | `q-btn` with custom CSS | Apply gradient background |
| Feature Cards | `q-card` + `q-card-section` | Feature showcase cards |
| Pricing Cards | `q-card` with `q-separator` | Pricing tier cards |
| Comparison Table | `q-table` | Feature comparison |
| Contact Form | `q-form` + `q-input` | Contact page form |
| FAQ Accordion | `q-expansion-item` | FAQ section |
| "Coming Soon" Badge | `q-badge` with custom styling | AI features indicator |
| Footer Links | `q-list` + `q-item` | Footer navigation |

### Firebase → Laravel Migration Notes

**Authentication Migration**:
- **From**: Firebase Auth (client-side SDK)
- **To**: Laravel Sanctum (JWT tokens)
- **Changes Needed**:
  - Replace Firebase Auth calls with Axios API calls
  - Store tokens in `localStorage` instead of Firebase session
  - Update auth state management in Pinia store

**Database Migration**:
- **From**: Firebase Firestore (NoSQL, real-time listeners)
- **To**: PostgreSQL (SQL, REST API polling/WebSockets)
- **Changes Needed**:
  - Replace Firestore queries with REST API calls
  - Replace real-time listeners with polling or WebSocket connections
  - Update data fetching patterns in Pinia stores

**File Storage Migration**:
- **From**: Firebase Storage
- **To**: MinIO/S3 (via Laravel)
- **Changes Needed**:
  - Replace Firebase Storage uploads with multipart form data to Laravel
  - Update file URL generation to use Laravel signed URLs

### UI/UX Design Considerations

**Prototype Design Patterns**:
- Dark theme with purple/blue gradient accents
- Modern, clean interface
- Prominent CTAs (Get Started buttons)
- Feature cards with icons
- Responsive design

**Quasar Implementation**:
- Use Quasar's dark mode support (`$q.dark.set(true)`)
- Custom theme colours in `quasar-variables.sass`
- Gradient buttons using CSS gradients
- Material Icons for feature icons
- Quasar's responsive utilities for mobile/desktop

---

## 7. Migration Considerations

### Key Differences from React/Next.js

1. **Component Syntax**: Vue SFCs vs JSX
2. **State Management**: Pinia vs Redux/Zustand
3. **Routing**: Vue Router vs Next.js routing (App Router)
4. **UI Framework**: Quasar components vs React component libraries
5. **API Communication**: Axios interceptors vs fetch/axios in React
6. **Form Validation**: Quasar built-in vs React Hook Form/Formik
7. **TypeScript**: Optional but recommended (similar to React)
8. **Backend**: Laravel REST API vs Firebase/Firestore
9. **Authentication**: Laravel Sanctum vs Firebase Auth
10. **Real-time**: WebSocket/polling vs Firebase real-time listeners

### Architecture Alignment

- Both use **SPA architecture** (Vue SPA vs Next.js can be SPA)
- Both use **RESTful API** communication (after migration)
- Both use **token-based authentication** (JWT)
- Both can use **TypeScript**
- Both support **component-based architecture**
- **Key Difference**: Firebase → Laravel backend migration required

---

## 8. Firebase Prototype Analysis & Migration Considerations

### 8.1. Prototype Overview
The Firebase Studio prototype is a **Crisis Communication Intelligence Platform (CCIP)** built with:
- **Frontend**: Next.js (App Router) + React
- **UI**: ShadCN UI + Tailwind CSS
- **Backend**: Firebase (Firestore + Firebase Authentication)
- **AI**: Google Genkit for report generation

### 8.2. Key Prototype Features to Migrate

#### 1. Role-Based Dashboard System
**Current Firebase Implementation:**
- Tab-based role switcher (Federal, State, LGA views)
- Dynamic metrics display based on user role
- Live heatmap visualization
- Emergency response center
- Activity feeds filtered by hierarchy level

**Migration Strategy for Vue/Quasar:**
```vue
<!-- Use Quasar's QTabs for role switching -->
<q-tabs v-model="activeRole" class="text-primary">
  <q-tab name="federal" label="Federal View" />
  <q-tab name="state" label="State View" />
  <q-tab name="lga" label="LGA View" />
</q-tabs>

<q-separator />

<q-tab-panels v-model="activeRole" animated>
  <q-tab-panel name="federal">
    <federal-dashboard :metrics="federalMetrics" />
  </q-tab-panel>
  <!-- ... other panels -->
</q-tab-panels>
```

#### 2. Activity Management System
**Features to Recreate:**
- Multi-step form with validation (zod → Yup/Quasar validation)
- Bulk actions on data tables
- Dynamic state/LGA dropdowns
- File upload with drag-and-drop
- Activity lifecycle states (Draft, Submitted, Approved)

**Component Mapping:**
- ShadCN Table → Quasar QTable with selection
- ShadCN Form → Quasar QForm with validation
- ShadCN Dialog → Quasar QDialog
- ShadCN Card → Quasar QCard

#### 3. Organization Hierarchy
**Current Structure:**
- Three-tier hierarchy (Federal → State → LGA)
- Parent-child relationships
- Organization categories (Govt, NGO, CSO)

**Laravel Model Structure:**
```php
// Organisation Model
class Organisation extends Model {
    public function parent() {
        return $this->belongsTo(Organisation::class, 'parent_id');
    }

    public function children() {
        return $this->hasMany(Organisation::class, 'parent_id');
    }

    public function users() {
        return $this->hasMany(User::class);
    }
}
```

#### 4. Team Directory & User Management
**Features to Implement:**
- User invitation system (email + CSV upload)
- Visual grid layout for team members
- Role-based permissions
- Bulk user actions

**Vue Implementation Strategy:**
```vue
<template>
  <q-page class="q-pa-lg">
    <!-- Search and Actions -->
    <div class="row q-mb-md">
      <q-input
        v-model="searchQuery"
        label="Search team members..."
        outlined
        class="col"
      />
      <q-btn
        color="primary"
        icon="person_add"
        label="Invite Members"
        @click="showInviteDialog = true"
      />
    </div>

    <!-- Team Grid -->
    <div class="row q-gutter-md">
      <div
        v-for="member in filteredTeam"
        :key="member.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card>
          <q-card-section>
            <q-avatar size="64px" class="q-mb-md">
              <img :src="member.avatar" />
            </q-avatar>
            <div class="text-h6">{{ member.name }}</div>
            <div class="text-caption">{{ member.role }}</div>
            <q-chip
              :color="member.status === 'Active' ? 'positive' : 'warning'"
              text-color="white"
              size="sm"
            >
              {{ member.status }}
            </q-chip>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
```

### 8.3. Authentication Migration

#### Firebase Auth → Laravel Sanctum
**Current Firebase Pattern:**
```javascript
// Firebase auth
const signIn = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  localStorage.setItem('token', token);
};
```

**Target Laravel Implementation:**
```typescript
// Vue auth store
export const useAuthStore = defineStore('auth', () => {
  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    token.value = response.data.token;
    user.value = response.data.user;

    // Store user role and organization level
    localStorage.setItem('userRole', response.data.user.role);
    localStorage.setItem('orgLevel', response.data.user.organization.level);
  };
});
```

### 8.4. Data Migration Strategy

#### Firestore → PostgreSQL
| Firebase Firestore | Laravel/PostgreSQL |
|-------------------|-------------------|
| Collections | Tables |
| Documents | Rows |
| Sub-collections | Related tables with foreign keys |
| Timestamp | timestamp or datetime |
| Array field | JSON field or junction table |

**Example Migration:**
```javascript
// Firebase Activity document
{
  id: "activity_123",
  title: "Vaccination Drive",
  status: "submitted",
  organizationId: "org_456",
  type: "health_campaign",
  dates: ["2024-01-15", "2024-01-16"],
  location: {
    state: "Lagos",
    lga: "Ikeja"
  }
}

// Laravel Migration
Schema::create('activities', function (Blueprint $table) {
  $table->id();
  $table->string('title');
  $table->enum('status', ['draft', 'submitted', 'approved', 'rejected']);
  $table->foreignId('organization_id')->constrained();
  $table->string('type');
  $table->json('dates'); // Store as JSON
  $table->string('state');
  $table->string('lga');
  $table->timestamps();
});
```

### 8.5. AI Integration Migration

#### Genkit → Laravel + Python/Node Service
**Current Genkit Flow:**
```javascript
// Firebase Genkit
export const generateReport = defineFlow(
  { name: 'generateReport' },
  async (input: { data: ActivityData[] }) => {
    const aiResponse = await generate({
      model: gemini15Flash,
      prompt: `Analyze this activity data: ${JSON.stringify(input.data)}`,
      config: { temperature: 0.7 }
    });
    return aiResponse.text;
  }
);
```

**Proposed Laravel Architecture:**
```php
// Laravel API endpoint
Route::post('/reports/generate-ai', [ReportController::class, 'generateAIReport']);

// Controller method
public function generateAIReport(Request $request) {
    $data = $request->validate([
        'activities' => 'required|array',
        'reportType' => 'required|string'
    ]);

    // Call external AI service
    $aiResponse = Http::post(config('services.ai.endpoint'), [
        'prompt' => $this->buildPrompt($data),
        'model' => 'gemini-1.5-flash'
    ]);

    return response()->json([
        'report' => $aiResponse->json('content')
    ]);
}
```

### 8.6. Component Mapping Guide

| Firebase/Next.js | Vue/Quasar Equivalent | Notes |
|------------------|----------------------|-------|
| next/router | Vue Router | Use meta fields for route guards |
| shadcn/ui components | Quasar QComponents | Most have 1:1 equivalents |
| tailwind CSS | Quasar CSS + SCSS | Use Quasar's utility classes |
| react-hook-form | QForm + validation | Quasar has built-in validation |
| recharts | Chart.js/ECharts | For data visualization |
| framer-motion | Quasar transitions | Use Quasar's animation system |
| lucide-react | Material Icons | Included with Quasar |
| next-auth | Laravel Sanctum | Token-based auth |
| prisma | Eloquent ORM | Laravel's built-in ORM |
| zod validation | Yup/Quasar rules | Form validation patterns |

### 8.7. Styling Migration

#### Tailwind to Quasar CSS
**Tailwind Pattern:**
```jsx
<div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>
```

**Quasar Equivalent:**
```vue
<template>
  <q-card flat bordered class="q-pa-md">
    <div class="row justify-between items-center">
      <div class="text-h6">Dashboard</div>
      <q-btn
        color="primary"
        label="Action"
        unelevated
      />
    </div>
  </q-card>
</template>
```

### 8.8. Real-time Features Migration

#### Firebase Realtime → Laravel + WebSocket/Server-Sent Events
```php
// Laravel broadcasting with Pusher/Soketi
Route::get('/activities/stream', function () {
    return response()->stream(function () {
        while (true) {
            // Stream new activities
            $activities = Activity::latest()->take(10)->get();
            echo "data: " . json_encode($activities) . "\n\n";
            ob_flush();
            flush();
            sleep(1);
        }
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
    ]);
});
```

### 8.9. File Storage Migration

#### Firebase Storage → Laravel + MinIO/S3
```php
// Laravel controller for file uploads
public function uploadFile(Request $request) {
    $request->validate([
        'file' => 'required|mimes:pdf,doc,docx|max:5120'
    ]);

    $path = $request->file('file')->store('activities', 's3');

    return response()->json([
        'url' => Storage::disk('s3')->url($path),
        'path' => $path
    ]);
}
```

### 8.10. Migration Checklist

#### Frontend Migration
- [ ] Convert Next.js pages to Vue pages
- [ ] Replace ShadCN components with Quasar equivalents
- [ ] Migrate Tailwind styles to Quasar CSS
- [ ] Implement Vue Router with navigation guards
- [ ] Set up Pinia stores for state management
- [ ] Convert form validation to Quasar patterns
- [ ] Implement role-based dashboard views

#### Backend Migration
- [ ] Set up Laravel with Sanctum authentication
- [ ] Create database migrations for all collections
- [ ] Implement API endpoints matching Firebase functions
- [ ] Set up file storage with MinIO/S3
- [ ] Configure CORS for frontend communication
- [ ] Implement queue system for background jobs
- [ ] Set up logging and monitoring

#### Data Migration
- [ ] Export Firestore data to JSON
- [ ] Transform data to match Laravel schema
- [ ] Run migration scripts
- [ ] Verify data integrity
- [ ] Update user authentication records
- [ ] Migrate file assets from Firebase Storage

#### Testing
- [ ] Write end-to-end tests for critical flows
- [ ] Test authentication across all roles
- [ ] Verify data consistency
- [ ] Performance testing
- [ ] Security audit
- [ ] User acceptance testing

---

## 9. Migration Considerations for React/Next.js

### Key Differences to Note:

1. **Template Syntax**:
   - React: JSX with curly braces `{}`
   - Vue: Template syntax with `{{ }}` and directives (`v-if`, `v-for`, `@click`)

2. **Component Definition**:
   - React: Functions returning JSX
   - Vue: Single File Components (.vue) with `<template>`, `<script>`, and `<style>`

3. **State Management**:
   - React: useState, useReducer, Redux, Context
   - Vue: ref, reactive, computed, Pinia

4. **Routing**:
   - Next.js: File-based routing
   - Vue: Vue Router with programmatic configuration

5. **Forms**:
   - React: Controlled components with state
   - Vue: v-model directive for two-way binding

6. **Styling**:
   - Next.js: CSS Modules, Styled Components
   - Vue/Quasar: Scoped styles, Quasar classes

7. **Data Fetching**:
   - Next.js: SWR, React Query, getServerSideProps
   - Vue: Composables with async/await patterns

8. **Real-time Updates**:
   - Firebase: Realtime listeners
   - Vue: WebSockets, Server-Sent Events, or polling

---

## Summary

This application uses a **decoupled architecture** with:
- **Frontend**: Vue 3 + Quasar SPA with Pinia state management
- **Backend**: Laravel RESTful API with Sanctum authentication
- **Communication**: Axios with centralized interceptors
- **Validation**: Quasar built-in validation + server-side Laravel validation
- **Routing**: Vue Router with route guards for auth and roles
- **TypeScript**: Supported but not required

The backend is planned but not yet fully implemented. The frontend structure is complete and ready for integration once the Laravel API is built according to the API contracts.

### Prototype Migration Context

The Firebase Studio prototype (Next.js/React with Firebase) is a comprehensive **Crisis Communication Intelligence Platform (CCIP)** that includes:
- **Role-Based Dashboards**: Federal, State, and LGA views with dynamic metrics
- **Activity Management**: Full CRUD with multi-step forms and bulk actions
- **Organization Hierarchy**: Three-tier structure (Federal → State → LGA)
- **Team Directory**: User invitation system and role management
- **Communication Hub**: Announcements and messaging system
- **Reports & Analytics**: AI-powered reports using Google Genkit
- **Settings**: Comprehensive configuration management

**Migration Path**:
1. Convert React components to Vue SFCs
2. Replace Firebase Auth with Laravel Sanctum
3. Replace Firestore with PostgreSQL + Laravel API
4. Map React UI patterns to Quasar components
5. Implement role-based dashboard views
6. Set up AI integration architecture
7. Migrate real-time features to WebSocket/SSE

This document provides the complete blueprint for migrating the prototype to the Vue/Quasar/Laravel stack.
