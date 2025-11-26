import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { useAuth0 } from '@auth0/auth0-react';

// Mock the useAuth0 hook
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

// Mock child components that use Auth0 or fetch data to simplify testing App logic
vi.mock('./pages/Dashboard', () => ({
  default: () => <div>Mock Dashboard</div>,
}));
vi.mock('./components/LoginButton', () => ({
  default: () => <button>Log In</button>,
}));
vi.mock('./components/LogoutButton', () => ({
  default: () => <button>Log Out</button>,
}));
vi.mock('./components/Profile', () => ({
  default: () => <div>Profile Component</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when loading', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      error: null,
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders login button when not authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.queryByText('Mock Dashboard')).not.toBeInTheDocument();
  });

  it('renders dashboard when authenticated and is admin', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: 'Admin User',
        'https://sauron-dashboard-bay.vercel.app/roles': ['Admin'],
      },
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mock Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
  });

  it('renders unauthorized when authenticated but not admin', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: 'Regular User',
        'https://sauron-dashboard-bay.vercel.app/roles': ['User'],
      },
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // App -> Routes -> Route('/') -> ProtectedRoute -> Navigate to /unauthorized
    // But we are using MemoryRouter. The navigation happens.
    // We need to check if /unauthorized route content is rendered.
    // Unauthorized component renders "Acceso Denegado"

    expect(screen.getByText(/Acceso Denegado/i)).toBeInTheDocument();
    expect(screen.queryByText('Mock Dashboard')).not.toBeInTheDocument();
  });

  it('renders error message when there is an authentication error', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: { message: 'Something went wrong' },
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error de autenticación/i)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
