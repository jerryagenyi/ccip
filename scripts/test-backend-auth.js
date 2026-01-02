#!/usr/bin/env node

/**
 * Backend Authentication Integration Test Script
 * 
 * Tests all authentication endpoints for US-001
 * 
 * Usage:
 *   node scripts/test-backend-auth.js [--base-url=http://localhost:8000]
 * 
 * Prerequisites:
 *   - Backend server running on http://localhost:8000
 *   - Database migrated and seeded (optional, for full tests)
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.API_URL || process.argv.find(arg => arg.startsWith('--base-url='))?.split('=')[1] || 'http://localhost:8000';
const API_BASE = `${BASE_URL}/api/v1`;

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            raw: body
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body,
            raw: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test runner
function test(name, fn) {
  return async () => {
    try {
      console.log(`\n${colors.cyan}▶${colors.reset} Testing: ${name}`);
      await fn();
      results.passed++;
      results.tests.push({ name, status: 'PASSED' });
      console.log(`${colors.green}✓${colors.reset} ${name} - PASSED`);
    } catch (error) {
      results.failed++;
      results.tests.push({ name, status: 'FAILED', error: error.message });
      console.log(`${colors.red}✗${colors.reset} ${name} - FAILED`);
      console.log(`${colors.red}  Error:${colors.reset} ${error.message}`);
      if (error.response) {
        console.log(`${colors.red}  Response:${colors.reset}`, JSON.stringify(error.response, null, 2));
      }
    }
  };
}

// Skip test
function skip(name, reason) {
  results.skipped++;
  results.tests.push({ name, status: 'SKIPPED', reason });
  console.log(`${colors.yellow}⊘${colors.reset} ${name} - SKIPPED (${reason})`);
}

// Main test suite
async function runTests() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  CCIP Backend Authentication Integration Tests${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\nBase URL: ${API_BASE}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  let authToken = null;
  let testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
    phone_number: '+1234567890'
  };

  // Test 1: Health Check
  await test('Health Check Endpoint', async () => {
    const response = await makeRequest('GET', '/system/health');
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    if (!response.data.status || response.data.status !== 'ok') {
      throw new Error(`Expected status 'ok', got '${response.data.status}'`);
    }
  })();

  // Test 2: Register New User
  await test('POST /auth/register - Valid Registration', async () => {
    const response = await makeRequest('POST', '/auth/register', {
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      password_confirmation: testUser.password,
      phone_number: testUser.phone_number,
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Expected 201/200, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
    }

    if (!response.data.success) {
      throw new Error(`Expected success: true, got ${response.data.success}`);
    }

    if (!response.data.data || !response.data.data.token) {
      throw new Error('Response missing token');
    }

    if (!response.data.data.user) {
      throw new Error('Response missing user data');
    }

    authToken = response.data.data.token;
    console.log(`  ${colors.green}✓${colors.reset} Token received: ${authToken.substring(0, 20)}...`);
    console.log(`  ${colors.green}✓${colors.reset} User ID: ${response.data.data.user.id}`);
  })();

  // Test 3: Register with Invalid Data
  await test('POST /auth/register - Invalid Email', async () => {
    const response = await makeRequest('POST', '/auth/register', {
      name: 'Test',
      email: 'invalid-email',
      password: 'password123',
      password_confirmation: 'password123',
    });

    if (response.status !== 422) {
      throw new Error(`Expected 422 (validation error), got ${response.status}`);
    }

    if (response.data.success !== false) {
      throw new Error('Expected success: false for validation error');
    }
  })();

  // Test 4: Register with Mismatched Passwords
  await test('POST /auth/register - Password Mismatch', async () => {
    const response = await makeRequest('POST', '/auth/register', {
      name: 'Test',
      email: 'test2@example.com',
      password: 'password123',
      password_confirmation: 'different123',
    });

    if (response.status !== 422) {
      throw new Error(`Expected 422 (validation error), got ${response.status}`);
    }
  })();

  // Test 5: Login with Valid Credentials
  await test('POST /auth/login - Valid Credentials', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
    }

    if (!response.data.success) {
      throw new Error(`Expected success: true, got ${response.data.success}`);
    }

    if (!response.data.data || !response.data.data.token) {
      throw new Error('Response missing token');
    }

    authToken = response.data.data.token; // Update token
    console.log(`  ${colors.green}✓${colors.reset} Login successful`);
    console.log(`  ${colors.green}✓${colors.reset} Token received: ${authToken.substring(0, 20)}...`);
  })();

  // Test 6: Login with Invalid Credentials
  await test('POST /auth/login - Invalid Credentials', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: 'wrongpassword',
    });

    if (response.status !== 422 && response.status !== 401) {
      throw new Error(`Expected 422/401, got ${response.status}`);
    }

    if (response.data.success !== false) {
      throw new Error('Expected success: false for invalid credentials');
    }
  })();

  // Test 7: Login with Non-existent User
  await test('POST /auth/login - Non-existent User', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    if (response.status !== 422 && response.status !== 401) {
      throw new Error(`Expected 422/401, got ${response.status}`);
    }
  })();

  // Test 8: Forgot Password
  await test('POST /auth/forgot-password - Valid Email', async () => {
    const response = await makeRequest('POST', '/auth/forgot-password', {
      email: testUser.email,
    });

    // Should return 200 or 202 (accepted)
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`Expected 200/202, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
    }

    console.log(`  ${colors.green}✓${colors.reset} Password reset email sent`);
  })();

  // Test 9: Forgot Password with Invalid Email
  await test('POST /auth/forgot-password - Invalid Email', async () => {
    const response = await makeRequest('POST', '/auth/forgot-password', {
      email: 'invalid-email',
    });

    if (response.status !== 422) {
      throw new Error(`Expected 422 (validation error), got ${response.status}`);
    }
  })();

  // Test 10: Logout (requires authentication)
  if (authToken) {
    await test('POST /auth/logout - Authenticated', async () => {
      const response = await makeRequest('POST', '/auth/logout', null, authToken);

      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
      }

      if (!response.data.success) {
        throw new Error(`Expected success: true, got ${response.data.success}`);
      }

      console.log(`  ${colors.green}✓${colors.reset} Logout successful`);
    })();
  } else {
    skip('POST /auth/logout - Authenticated', 'No auth token available');
  }

  // Test 11: Logout without Authentication
  await test('POST /auth/logout - Unauthenticated', async () => {
    const response = await makeRequest('POST', '/auth/logout');

    if (response.status !== 401) {
      throw new Error(`Expected 401 (unauthorized), got ${response.status}`);
    }
  })();

  // Test 12: Refresh Token (requires authentication)
  if (authToken) {
    // Re-login to get a fresh token for refresh test
    const loginResponse = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });

    if (loginResponse.status === 200 && loginResponse.data.data.token) {
      authToken = loginResponse.data.data.token;

      await test('POST /auth/refresh - Authenticated', async () => {
        const response = await makeRequest('POST', '/auth/refresh', null, authToken);

        // Refresh might return 200 with new token or 200 with same token
        if (response.status !== 200) {
          throw new Error(`Expected 200, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
        }

        console.log(`  ${colors.green}✓${colors.reset} Token refresh successful`);
      })();
    } else {
      skip('POST /auth/refresh - Authenticated', 'Could not get fresh token for refresh test');
    }
  } else {
    skip('POST /auth/refresh - Authenticated', 'No auth token available');
  }

  // Test 13: Refresh Token without Authentication
  await test('POST /auth/refresh - Unauthenticated', async () => {
    const response = await makeRequest('POST', '/auth/refresh');

    if (response.status !== 401) {
      throw new Error(`Expected 401 (unauthorized), got ${response.status}`);
    }
  })();

  // Test 14: Protected Route Access
  if (authToken) {
    // Re-login to get a fresh token
    const loginResponse = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });

    if (loginResponse.status === 200 && loginResponse.data.data.token) {
      authToken = loginResponse.data.data.token;

      await test('GET /users/me - Authenticated', async () => {
        const response = await makeRequest('GET', '/users/me', null, authToken);

        if (response.status !== 200) {
          throw new Error(`Expected 200, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
        }

        if (!response.data.success) {
          throw new Error(`Expected success: true, got ${response.data.success}`);
        }

        if (!response.data.data || !response.data.data.id) {
          throw new Error('Response missing user data');
        }

        console.log(`  ${colors.green}✓${colors.reset} User data retrieved: ${response.data.data.name}`);
      })();
    } else {
      skip('GET /users/me - Authenticated', 'Could not get fresh token');
    }
  } else {
    skip('GET /users/me - Authenticated', 'No auth token available');
  }

  // Test 15: Protected Route without Authentication
  await test('GET /users/me - Unauthenticated', async () => {
    const response = await makeRequest('GET', '/users/me');

    if (response.status !== 401) {
      throw new Error(`Expected 401 (unauthorized), got ${response.status}`);
    }
  })();

  // Print summary
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Test Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\nTotal Tests: ${results.tests.length}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${results.skipped}${colors.reset}`);
  console.log(`\nCompleted: ${new Date().toISOString()}\n`);

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal Error:${colors.reset}`, error);
  process.exit(1);
});

