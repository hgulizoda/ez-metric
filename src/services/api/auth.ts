import type { LoginCredentials, LoginResponse, User } from '@/types';

const MOCK_USERS: Record<string, { user: User; password: string; token: string }> = {
  ash: {
    password: 'admin123',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.mock',
    user: {
      id: 'usr-001',
      username: 'ash',
      name: 'Ash Rojas',
      email: 'ash.rojas@example.com',
      role: 'admin',
      department: 'Office',
      createdAt: '2023-01-15T00:00:00Z',
    },
  },
  justin: {
    password: 'manager123',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.manager.mock',
    user: {
      id: 'usr-002',
      username: 'justin',
      name: 'Justin Naranjo',
      email: 'justin.naranjo@example.com',
      role: 'manager',
      department: 'Mechanical Floor',
      createdAt: '2023-03-20T00:00:00Z',
    },
  },
};

export async function apiLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const record = MOCK_USERS[credentials.username.toLowerCase()];

  if (!record || record.password !== credentials.password) {
    throw new Error('Invalid username or password. Please try again.');
  }

  return {
    user: record.user,
    token: record.token,
  };
}

export async function apiLogout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}

export async function apiGetCurrentUser(token: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const entry = Object.values(MOCK_USERS).find((r) => r.token === token);
  if (!entry) {
    throw new Error('Invalid session. Please log in again.');
  }
  return entry.user;
}
