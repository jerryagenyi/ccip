# Frontend Architecture

## Executive Summary

The CCIP frontend is a modern Vue 3 + Quasar web application designed for Crisis Communication Intelligence. It provides a responsive, user-friendly interface for managing crisis communications, with features including user management, activity tracking, dashboards, and real-time messaging.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|----------------|
| **Framework** | Vue.js | 3.4.21 | Reactive component framework with Composition API |
| **UI Library** | Quasar | 2.14.2 | Material Design components with mobile-first responsive design |
| **State Management** | Pinia | 2.1.7 | Official Vue 3 state management, TypeScript support |
| **Routing** | Vue Router | 4.3.0 | Declarative routing with route guards |
| **HTTP Client** | Axios | 1.6.7 | Promise-based HTTP client with interceptors |
| **Build Tool** | Vite | 5.1.0 | Fast development server and optimized builds |
| **Language** | TypeScript | - | Static typing and improved developer experience |
| **Testing** | Vitest + Playwright | 1.0.0 / 1.40.0 | Unit testing and end-to-end testing |

## Architecture Pattern

### Component-Based Architecture with Centralized State

The frontend follows Vue.js best practices with a component-based architecture:

1. **Components**: Reusable, self-contained UI elements
2. **Composition API**: Logic extraction and reuse
3. **Centralized State**: Pinia stores for global state
4. **Service Layer**: API abstraction and data transformation

## Data Architecture

### State Management Structure

```typescript
// Main Pinia Stores
stores/
├── useUserStore.ts        // User authentication and profile
├── useOrganisationStore.ts // Organization data
├── useDashboardStore.ts    // Dashboard state and analytics
├── useTemplateStore.ts     // Message templates
├── useActivityStore.ts     // Activity tracking
├── useReportStore.ts       // Report generation
├── useAnalyticsStore.ts    // Analytics data
├── useHelpStore.ts         // Help and documentation
├── useMessageStore.ts      // Messaging and notifications
├── useNotificationStore.ts // System notifications
└── useOnboardingStore.ts   // User onboarding flow
```

### Example Store: Activity Store
```typescript
import { defineStore } from 'pinia'
import { api } from 'src/services/api'

interface Activity {
  id: string
  title: string
  type: string
  status: 'draft' | 'submitted' | 'approved' | 'completed'
  organisationId: string
  createdAt: string
  updatedAt: string
}

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as Activity[],
    currentActivity: null as Activity | null,
    loading: false,
    filters: {
      status: null,
      type: null,
      search: ''
    }
  }),

  getters: {
    activitiesByStatus: (state) => {
      return (status: string) =>
        state.activities.filter(a => a.status === status)
    },

    filteredActivities: (state) => {
      return state.activities.filter(activity => {
        if (state.filters.status && activity.status !== state.filters.status) {
          return false
        }
        if (state.filters.type && activity.type !== state.filters.type) {
          return false
        }
        if (state.filters.search && !activity.title.includes(state.filters.search)) {
          return false
        }
        return true
      })
    }
  },

  actions: {
    async fetchActivities() {
      this.loading = true
      try {
        const { data } = await api.get('/activities', {
          params: this.filters
        })
        this.activities = data.data
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        this.loading = false
      }
    },

    async createActivity(activity: Partial<Activity>) {
      try {
        const { data } = await api.post('/activities', activity)
        this.activities.push(data.data)
        return data.data
      } catch (error) {
        console.error('Failed to create activity:', error)
        throw error
      }
    },

    async updateActivity(id: string, updates: Partial<Activity>) {
      try {
        const { data } = await api.put(`/activities/${id}`, updates)
        const index = this.activities.findIndex(a => a.id === id)
        if (index !== -1) {
          this.activities[index] = data.data
        }
        return data.data
      } catch (error) {
        console.error('Failed to update activity:', error)
        throw error
      }
    },

    async submitActivity(id: string) {
      try {
        const { data } = await api.post(`/activities/${id}/submit`)
        const activity = this.activities.find(a => a.id === id)
        if (activity) {
          activity.status = 'submitted'
        }
        return data
      } catch (error) {
        console.error('Failed to submit activity:', error)
        throw error
      }
    }
  }
})
```

## Component Architecture

### Page Components (Route-based)

#### Dashboard Page
```vue
<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12">
        <dashboard-stats />
      </div>
      <div class="col-md-8 col-12">
        <activity-list />
      </div>
      <div class="col-md-4 col-12">
        <recent-notifications />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DashboardStats from 'components/DashboardStats.vue'
import ActivityList from 'components/ActivityList.vue'
import RecentNotifications from 'components/RecentNotifications.vue'
import { useDashboardStore } from 'stores/dashboard'

const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchStats()
})
</script>
```

#### Activity Form Component
```vue
<template>
  <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
    <q-input
      v-model="form.title"
      label="Activity Title"
      :rules="[val => !!val || 'Title is required']"
    />

    <q-select
      v-model="form.type"
      :options="activityTypes"
      label="Activity Type"
      emit-value
      map-options
    />

    <q-editor
      v-model="form.description"
      label="Description"
      min-height="10rem"
    />

    <div class="row q-gutter-md">
      <q-btn
        type="submit"
        color="primary"
        label="Save as Draft"
        :loading="saving"
      />
      <q-btn
        @click="submitForApproval"
        color="secondary"
        label="Submit for Approval"
        :loading="submitting"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useActivityStore } from 'stores/activity'
import { useRouter } from 'vue-router'

const activityStore = useActivityStore()
const router = useRouter()

const form = reactive({
  title: '',
  type: '',
  description: ''
})

const saving = ref(false)
const submitting = ref(false)

const activityTypes = [
  { label: 'Campaign', value: 'campaign' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Meeting', value: 'meeting' }
]

const handleSubmit = async () => {
  saving.value = true
  try {
    const activity = await activityStore.createActivity(form)
    router.push(`/activities/${activity.id}`)
  } finally {
    saving.value = false
  }
}

const submitForApproval = async () => {
  submitting.value = true
  try {
    const activity = await activityStore.createActivity(form)
    await activityStore.submitActivity(activity.id)
    router.push('/activities')
  } finally {
    submitting.value = false
  }
}
</script>
```

### Shared Components

#### DataTable Component
```vue
<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
  >
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-chip
          :color="getStatusColor(props.value)"
          :label="props.value"
        />
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          icon="edit"
          @click="editItem(props.row)"
        />
        <q-btn
          flat
          round
          icon="delete"
          @click="deleteItem(props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DataTableColumn {
  name: string
  required: boolean
  label: string
  align: 'left' | 'right' | 'center'
  field: string
  format?: (val: any) => string
}

const props = defineProps<{
  rows: any[]
  loading: boolean
  columns: DataTableColumn[]
}>()

const emit = defineEmits<{
  edit: [item: any]
  delete: [item: any]
  request: [props: any]
}>()

const filter = ref('')

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'grey',
    submitted: 'orange',
    approved: 'green',
    completed: 'blue'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const editItem = (item: any) => {
  emit('edit', item)
}

const deleteItem = (item: any) => {
  emit('delete', item)
}

const onRequest = (props: any) => {
  emit('request', props)
}
</script>
```

## Routing Architecture

### Route Configuration
```typescript
// router/routes.ts
export const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'activities',
        name: 'activities',
        component: () => import('pages/ActivitiesPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'activities/:id',
        name: 'activity-detail',
        component: () => import('pages/ActivityDetailPage.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: 'activities/create',
        name: 'activity-create',
        component: () => import('pages/ActivityFormPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue')
      }
    ]
  }
]
```

### Route Guards
```typescript
// router/guards.ts
import { useUserStore } from 'stores/user'

export const authGuard = (to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

export const roleGuard = (roles) => (to, from, next) => {
  const userStore = useUserStore()

  if (roles && !roles.includes(userStore.user?.role)) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}
```

## Service Layer

### API Service Configuration
```typescript
// services/api.ts
import axios from 'axios'
import { useUserStore } from 'stores/user'

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
```

## Integration with Backend

### Authentication Flow
```typescript
// services/auth.ts
import { api } from './api'

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  async register(userData: any) {
    const { data } = await api.post('/auth/register', userData)
    return data
  },

  async logout() {
    await api.post('/auth/logout')
  },

  async refreshToken() {
    const { data } = await api.post('/auth/refresh')
    return data
  },

  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(token: string, password: string) {
    const { data } = await api.post('/auth/reset-password', {
      token,
      password,
      password_confirmation: password
    })
    return data
  }
}
```

## Performance Optimizations

### Code Splitting
```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/activities',
      component: () => import('pages/ActivitiesPage.vue') // Lazy loaded
    }
  ]
})
```

### Lazy Loading Images
```vue
<template>
  <q-img
    :src="imageUrl"
    loading="lazy"
    placeholder-src="data:image/svg+xml,..."
  />
</template>
```

### Virtual Scrolling
```vue
<template>
  <q-virtual-scroll
    :items="largeList"
    :item-size="50"
    style="max-height: 400px"
  >
    <template #default="{ item, index }">
      <q-item clickable>
        <q-item-section>{{ item }}</q-item-section>
      </q-item>
    </template>
  </q-virtual-scroll>
</template>
```

## Testing Strategy

### Component Testing (Vitest)
```typescript
// tests/components/ActivityCard.spec.ts
import { mount } from '@vue/test-utils'
import ActivityCard from 'components/ActivityCard.vue'

describe('ActivityCard', () => {
  it('renders activity title', () => {
    const activity = {
      id: '1',
      title: 'Test Activity',
      status: 'draft'
    }

    const wrapper = mount(ActivityCard, {
      props: { activity }
    })

    expect(wrapper.text()).toContain('Test Activity')
  })

  it('emits edit event when edit button clicked', async () => {
    const activity = {
      id: '1',
      title: 'Test Activity',
      status: 'draft'
    }

    const wrapper = mount(ActivityCard, {
      props: { activity }
    })

    await wrapper.find('[data-testid="edit-button"]').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0]).toEqual([activity])
  })
})
```

### E2E Testing (Playwright)
```typescript
// tests/e2e/activity-workflow.spec.ts
import { test, expect } from '@playwright/test'

test('user can create and submit activity', async ({ page }) => {
  // Login
  await page.goto('/auth/login')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password')
  await page.click('[data-testid="login-button"]')

  // Navigate to create activity
  await page.click('[data-testid="create-activity-btn"]')

  // Fill form
  await page.fill('[data-testid="activity-title"]', 'Test Activity')
  await page.selectOption('[data-testid="activity-type"]', 'campaign')
  await page.fill('[data-testid="activity-description"]', 'Test description')

  // Save and submit
  await page.click('[data-testid="save-button"]')
  await page.click('[data-testid="submit-button"]')

  // Verify submission
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

## Security Features

### XSS Protection
```vue
<template>
  <!-- Auto-escaped -->
  <div>{{ userContent }}</div>

  <!-- For dynamic HTML, use v-html with caution -->
  <div v-html="sanitizedHtml" />
</template>
```

### CSRF Protection
```typescript
// services/api.ts
api.defaults.headers.common['X-CSRF-TOKEN'] =
  document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
```

## Accessibility

### ARIA Labels
```vue
<template>
  <q-btn
    icon="add"
    label="Create Activity"
    aria-label="Create new activity"
  />
</template>
```

### Keyboard Navigation
```vue
<template>
  <q-input
    ref="searchInput"
    label="Search"
    @keydown.enter="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const searchInput = ref()

onMounted(() => {
  searchInput.value?.focus()
})
</script>
```

---

*For detailed component patterns, see: [Frontend Development Guide](../guides/frontend/)*