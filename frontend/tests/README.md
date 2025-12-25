# CCIP Frontend Testing Guide

This guide covers the complete testing setup for the CCIP (Crisis Communication Intelligence Platform) frontend application.

## Table of Contents

- [Test Architecture](#test-architecture)
- [Environment Setup](#environment-setup)
- [Running Tests](#running-tests)
- [Test Types](#test-types)
- [Writing Tests](#writing-tests)
- [Test Data Management](#test-data-management)
- [CI/CD Integration](#cicd-integration)
- [Debugging](#debugging)
- [Best Practices](#best-practices)

## Test Architecture

### Technology Stack
- **Unit Testing**: Vitest with Vue Test Utils
- **E2E Testing**: Playwright
- **Test Data**: Faker.js for realistic test data generation
- **Assertions**: Playwright's built-in expect API
- **Reporting**: HTML reports for local, JUnit for CI

### Directory Structure
```
frontend/tests/
├── e2e/                          # E2E test scenarios
│   └── auth-production.spec.ts   # Production authentication tests
├── support/                      # Test infrastructure
│   ├── fixtures/                 # Test fixtures and data factories
│   │   ├── index.ts             # Fixture definitions
│   │   └── factories/           # Data factories
│   │       └── user-factory.ts  # User creation utilities
│   ├── helpers/                 # Custom test helpers (future)
│   └── page-objects/           # Page object models (future)
└── README.md                    # This file
```

## Environment Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (for backend services)

### Initial Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Install Playwright browsers:
```bash
npm run playwright:install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# For CI/ automated testing
cp .env.example .env.test
```

4. Start required services:
```bash
# Using Docker (recommended)
docker-compose up -d backend

# Or start backend manually
cd ../backend
php artisan serve
```

### Environment Variables

Key variables for testing:

```bash
# Application URLs
BASE_URL=https://ccip.jerryagenyi.xyz          # Frontend URL
API_URL=https://ccip-api.jerryagenyi.xyz/api/v1  # Backend API URL

# Test Configuration
NODE_ENV=test                                     # Test environment
TEST_ENV=e2e                                     # Test type
CI=false                                         # CI mode flag

# Timeouts (milliseconds)
TEST_TIMEOUT=60000                               # Overall test timeout
ACTION_TIMEOUT=15000                             # Individual action timeout
NAVIGATION_TIMEOUT=30000                         # Page navigation timeout

# Browser Configuration
HEADED=false                                     # Headless mode
SLOWMO=0                                         # Slow motion factor

# Reporting
REPORTER=html                                    # Report type
REPORT_OUTPUT_DIR=test-results/html             # Report output
```

## Running Tests

### Local Development

```bash
# Run all unit tests
npm test
# or
npm run test:unit

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed

# Run E2E tests with Playwright UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

### Production Testing

```bash
# Run production authentication tests
npm run test:e2e:prod

# Run production tests with visible browser
npm run test:e2e:prod:headed
```

### CI/CD Testing

```bash
# Run tests in CI mode
npm run test:ci

# Run production tests with JUnit reporter
npm run test:ci:prod
```

### Test Code Generation

```bash
# Generate test code using codegen
npm run playwright:codegen

# Generate tests for specific URL
npm run playwright:codegen https://ccip.jerryagenyi.xyz
```

## Test Types

### 1. Unit Tests (.spec.ts in src/)
- Test individual components and functions
- Fast execution
- Mock external dependencies
- Run with Vitest

Example:
```typescript
import { describe, it, expect } from 'vitest'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    expect(true).toBe(true)
  })
})
```

### 2. E2E Tests (tests/e2e/)
- Test complete user workflows
- Real browser automation
- Test against actual application
- Run with Playwright

Example structure:
```typescript
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/#/auth/login')
    // Test implementation
  })
})
```

## Writing Tests

### Test Structure

Follow this structure for E2E tests:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/target-page')
  })

  // Individual test cases
  test('should perform specific action', async ({ page }) => {
    // 1. Arrange - Set up test data
    // 2. Act - Perform actions
    // 3. Assert - Verify results
  })
})
```

### Best Practices

1. **Use descriptive test names**: "should redirect to dashboard after login"
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Use selectors wisely**: Prefer data-testid attributes
4. **Wait for elements**: Use `waitForSelector` for dynamic content
5. **Clean up test data**: Use fixtures with automatic cleanup

### Selectors Guide

```typescript
// Good: Use data-testid attributes
page.locator('[data-testid="login-button"]')

// Good: Use accessible labels
page.locator('button:has-text("Login")')

// Avoid: Brittle CSS selectors
page.locator('.login-form > div:nth-child(3) > button')
```

## Test Data Management

### Data Factories

Use the provided data factories for consistent test data:

```typescript
import { test, expect } from '@/tests/support/fixtures'

test('should create and authenticate user', async ({ userFactory }) => {
  // Create test user
  const user = await userFactory.createRegularUser({
    email: 'test@example.com'
  })

  // Use user credentials
  await page.locator('[data-testid="email"]').fill(user.email)
  await page.locator('[data-testid="password"]').fill(user.password)
  // ... rest of test
})
```

### Available Factory Methods

- `createUser(overrides?)`: Create a basic user
- `createAdmin(overrides?)`: Create an admin user
- `createSuperAdmin(overrides?)`: Create a super admin
- `createRegularUser(overrides?)`: Create a regular user
- `createMultipleUsers(count, overrides?)`: Create multiple users
- `cleanup()`: Clean up created users

### Test Credentials

For testing against production, use seeded credentials:
```typescript
const TEST_CREDENTIALS = {
  email: 'admin@ccip.local',
  password: 'password',
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run playwright:install
      - run: npm run test:ci:prod
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: test-results/
```

### Environment Variables for CI

```bash
NODE_ENV=test
CI=true
BASE_URL=https://your-staging-url.com
API_URL=https://your-api-url.com/api/v1
```

## Debugging

### Playwright Inspector

```bash
# Debug with inspector
npm run test:e2e:debug

# Debug specific test
npx playwright test --debug tests/e2e/auth-production.spec.ts
```

### Browser Developer Tools

```bash
# Run in headed mode to see browser
npm run test:e2e:headed

# Run with slow motion for debugging
SLOWMO=1000 npm run test:e2e:headed
```

### Taking Screenshots

```typescript
// Manual screenshot
await page.screenshot({ path: 'debug.png' })

// Automatic on failure (configured in playwright.config.ts)
screenshot: 'only-on-failure'
```

### Trace Viewer

```bash
# View trace after test failure
npm run playwright:report
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use beforeEach/afterEach for setup/teardown
- Keep tests independent and isolated

### 2. Selectors
- Prefer `data-testid` attributes for test-specific elements
- Use semantic HTML selectors when possible
- Avoid implementation-specific CSS selectors

### 3. Waits and Timeouts
- Use explicit waits over implicit waits
- Configure appropriate timeouts in playwright.config.ts
- Handle dynamic content with waitForSelector

### 4. Test Data
- Use factories for consistent test data
- Clean up data after tests
- Use realistic but not real user data

### 5. Error Handling
- Provide clear error messages
- Include relevant context in assertions
- Use try-catch for non-critical assertions

### 6. Performance
- Run tests in parallel when possible
- Reuse browser instances between tests
- Optimize test data creation

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in playwright.config.ts
2. **Selector not found**: Check if element exists, use waitForSelector
3. **Flaky tests**: Ensure proper cleanup and isolation
4. **Authentication issues**: Verify test user credentials

### Getting Help

- Check Playwright documentation: https://playwright.dev/
- Review test results in HTML report
- Use browser dev tools for debugging
- Check console logs for errors

## Test Coverage

### Current Coverage

- ✅ User Authentication (login, logout, registration)
- ✅ Route Guards (protected routes)
- ✅ Token Management
- ✅ Form Validation
- 📝 Dashboard functionality
- 📝 User management
- 📝 Data visualization
- 📝 Offline functionality

### Future Tests

- [ ] File upload/download
- [ ] Real-time updates
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Performance benchmarks
- [ ] Cross-browser compatibility

## Contributing

When adding new tests:

1. Follow existing test patterns
2. Use data factories for test data
3. Include proper cleanup
4. Update documentation
5. Test both happy path and edge cases
6. Ensure tests run reliably in CI

---

Last updated: 2025-01-22
For questions, reach out to the development team.