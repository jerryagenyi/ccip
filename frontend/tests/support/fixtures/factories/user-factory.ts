import { faker } from '@faker-js/faker';

interface CCIPUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'sub_admin' | 'user';
  organisation_id?: string | null;
  is_active: boolean;
  email_verified_at: string;
  phone_number?: string | null;
}

interface CreateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: CCIPUser['role'];
  organisation_id?: string | null;
  phone_number?: string | null;
  isActive?: boolean;
}

/**
 * CCIP User Factory
 * Creates test users for authentication testing with proper cleanup
 */
export class UserFactory {
  private createdUsers: string[] = [];
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.API_URL || 'https://ccip-api.jerryagenyi.xyz/api/v1';
  }

  /**
   * Create a test user via API
   */
  async createUser(userData: CreateUserData = {}): Promise<CCIPUser> {
    const user: CCIPUser = {
      id: faker.string.uuid(),
      name: userData.name || faker.person.fullName(),
      email: userData.email || faker.internet.email().toLowerCase(),
      password: userData.password || faker.internet.password({ length: 12, memorable: true }),
      role: userData.role || 'user',
      organisation_id: userData.organisation_id || null,
      is_active: userData.isActive !== false,
      email_verified_at: new Date().toISOString(),
      phone_number: userData.phone_number || faker.phone.number(),
    };

    // Create user via API
    const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        password_confirmation: user.password,
        role: user.role,
        organisation_id: user.organisation_id,
        phone_number: user.phone_number,
        acceptTerms: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create test user: ${error}`);
    }

    const created = await response.json();
    this.createdUsers.push(created.data.user.id);
    return created.data.user;
  }

  /**
   * Create an admin user (with elevated permissions)
   */
  async createAdmin(overrides: CreateUserData = {}): Promise<CCIPUser> {
    return this.createUser({
      ...overrides,
      role: 'admin',
      name: overrides.name || `Admin ${faker.person.firstName()}`,
    });
  }

  /**
   * Create a super admin user (maximum permissions)
   */
  async createSuperAdmin(overrides: CreateUserData = {}): Promise<CCIPUser> {
    return this.createUser({
      ...overrides,
      role: 'super_admin',
      name: overrides.name || `Super Admin ${faker.person.firstName()}`,
    });
  }

  /**
   * Create a regular user
   */
  async createRegularUser(overrides: CreateUserData = {}): Promise<CCIPUser> {
    return this.createUser({
      ...overrides,
      role: 'user',
      name: overrides.name || faker.person.fullName(),
    });
  }

  /**
   * Get existing test user credentials
   */
  static getTestCredentials() {
    return {
      email: 'admin@ccip.local',
      password: 'password',
    };
  }

  /**
   * Cleanup all created users via API
   */
  async cleanup(): Promise<void> {
    // Note: In a real implementation, you'd have a DELETE endpoint
    // For now, just clear the tracking array
    this.createdUsers = [];
  }

  /**
   * Create multiple users in batch
   */
  async createMultipleUsers(count: number, overrides: CreateUserData = {}): Promise<CCIPUser[]> {
    const users: CCIPUser[] = [];
    for (let i = 0; i < count; i++) {
      const user = await this.createUser({
        ...overrides,
        email: overrides.email ? `${overrides.email}+${i}@example.com` : undefined,
      });
      users.push(user);
    }
    return users;
  }
}

export default UserFactory;