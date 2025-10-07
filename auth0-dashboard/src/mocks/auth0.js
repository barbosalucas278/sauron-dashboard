import { vi } from 'vitest';

export const useAuth0 = vi.fn().mockReturnValue({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn(),
});