# CCIP Frontend

Vue 3 + Quasar frontend application for CCIP platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Development

Run development server:
```bash
npm run dev
```

Application will be available at: http://localhost:5173

## Project Structure

```
src/
├── components/     # Reusable Vue components
│   ├── base/      # Base components (wrapped Quasar)
│   ├── forms/     # Form components
│   └── layout/    # Layout components
├── pages/          # Route pages
├── stores/         # Pinia stores
│   ├── useAuthStore.ts
│   ├── useUserStore.ts
│   ├── useOrganisationStore.ts
│   ├── useActivityStore.ts
│   ├── useTemplateStore.ts
│   ├── useDashboardStore.ts
│   ├── useAnalyticsStore.ts
│   ├── useMessageStore.ts
│   ├── useNotificationStore.ts
│   ├── useHelpStore.ts
│   └── useOnboardingStore.ts
├── services/       # API services
│   └── api.ts     # Axios instance with interceptors
├── router/         # Vue Router config
│   ├── index.ts
│   ├── routes.ts
│   └── guards.ts
├── layouts/        # Quasar layouts
│   ├── MainLayout.vue
│   └── AuthLayout.vue
└── boot/           # Quasar boot files
    ├── axios.ts
    └── router.ts
```

## Stores

All Pinia stores are set up with:
- TypeScript interfaces
- State management
- API integration
- Loading states
- Error handling

## Routing

Routes are configured for all pages:
- Authentication routes (`/auth/*`)
- User routes (`/profile`)
- Activity routes (`/activities/*`)
- Dashboard routes (`/dashboard`)
- Organisation routes (`/organisations/*`) - Admin only
- Communication routes (`/messages/*`)
- Help routes (`/help/*`)

Route guards are implemented:
- `authGuard` - Requires authentication
- `guestGuard` - Redirects authenticated users
- `roleGuard` - Requires specific role

## API Service

Centralized Axios instance with:
- Base URL configuration
- Authentication token injection
- Error handling
- Quasar Notify integration

## Testing

### E2E Tests (Playwright)

E2E tests are located in `tests/e2e/` and use Playwright.

#### Running Tests

**Local Development:**
```bash
npm run test:e2e
```

**Production Testing:**
Test against the live deployment:
```bash
BASE_URL=https://ccip.jerryagenyi.xyz API_URL=https://ccip-api.jerryagenyi.xyz/api/v1 npx playwright test tests/e2e/auth-production.spec.ts
```

**Specific Test Suite:**
```bash
# Production auth flow tests
npx playwright test tests/e2e/auth-production.spec.ts

# CI test suite (localhost)
npx playwright test tests/e2e/auth-ci-suite.spec.ts
```

#### Test Coverage

- **Infrastructure Tests**: Frontend/backend connectivity, CORS, API endpoints
- **Login Flow**: Valid/invalid credentials, form validation
- **Registration Flow**: Multi-step registration process
- **Logout Flow**: Token clearing, redirect behavior
- **Route Guards**: Protected route access, authentication redirects
- **Token Management**: Storage, retrieval, cleanup

#### Test Credentials

Production tests use seeded admin credentials:
- Email: `admin@ccip.local`
- Password: `password`

**Note**: These are test accounts created by database seeders.

### Unit Tests (Vitest)

Unit tests are located in `tests/` and use Vitest.

```bash
# Run unit tests
npm run test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## Next Steps

1. **Design in Figma** - Create UI/UX designs
2. **Export Components** - Export from Figma to Vue
3. **Wrap in Quasar** - Convert to Quasar components
4. **Connect to Stores** - Wire up Pinia stores
5. **Add Mock Data** - Use mock data until backend ready

## Design Integration

See `design/figma-quasar-mapping.md` for component mapping guide.

See `design/component-data-requirements.md` for data structures.

See `design/figma-export-guide.md` for export process.
