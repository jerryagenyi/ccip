/**
 * Build Test
 * 
 * This test ensures that the application can be built successfully.
 * It catches SASS compilation errors, TypeScript errors, and other build-time issues
 * that unit tests and E2E tests don't catch.
 * 
 * Why this is needed:
 * - Unit tests (Vitest) only test JavaScript/TypeScript logic, not the build process
 * - E2E tests (Playwright) test browser interactions, not build compilation
 * - SASS compilation happens during build, not during test execution
 * - Build errors only surface when running `npm run build` or in CI/CD
 */

import { describe, it } from 'vitest';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

describe('Build', () => {
  it('should build successfully without errors', () => {
    try {
      // Run the build command
      execSync('npm run build', {
        cwd: projectRoot,
        stdio: 'pipe', // Suppress output unless there's an error
        timeout: 300000, // 5 minute timeout
      });
    } catch (error: any) {
      // If build fails, show the error output
      const errorMessage = error.stdout?.toString() || error.stderr?.toString() || error.message;
      throw new Error(`Build failed:\n${errorMessage}`);
    }
  }, 300000); // 5 minute timeout
});

