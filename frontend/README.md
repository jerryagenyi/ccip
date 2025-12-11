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
