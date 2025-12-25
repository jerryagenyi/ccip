import { test as base } from '@playwright/test';
import { UserFactory } from './factories/user-factory';

// Types for test fixtures
type TestFixtures = {
  userFactory: UserFactory;
};

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  userFactory: async ({}, use) => {
    const factory = new UserFactory();
    await use(factory);
    // Cleanup will be called automatically
    await factory.cleanup();
  },
});

export { expect } from '@playwright/test';