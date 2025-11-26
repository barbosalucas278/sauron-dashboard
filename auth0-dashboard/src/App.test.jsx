import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0 hook
vi.mock('@auth0/auth0-react');

describe('App Component', () => {
    it('renders loading state', () => {
        useAuth0.mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
        });

        render(<App />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders login button when not authenticated', () => {
        useAuth0.mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        });

        render(<App />);
        expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
        expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    });

    it('renders dashboard when authenticated', () => {
        useAuth0.mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
            user: { name: 'Test User', sub: 'auth0|123' },
            logout: vi.fn(),
        });

        render(<App />);
        expect(screen.getByText(/Auth0 Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    });
});
