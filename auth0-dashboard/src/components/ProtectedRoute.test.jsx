import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/Unauthorized';

// Mock the useAuth0 hook
vi.mock('@auth0/auth0-react');

const TestDashboard = () => <div>Dashboard Page</div>;

describe('ProtectedRoute', () => {
  it('renders loading state', () => {
    useAuth0.mockReturnValue({
      isLoading: true,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('redirects non-admin users to /unauthorized', () => {
    const namespace = 'https://sauron-dashboard-bay.vercel.app/';
    useAuth0.mockReturnValue({
      isLoading: false,
      user: {
        [`${namespace}roles`]: ['User'],
      },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
  });

  it('allows admin users to access the dashboard', () => {
    const namespace = 'https://sauron-dashboard-bay.vercel.app/';
    useAuth0.mockReturnValue({
      isLoading: false,
      user: {
        [`${namespace}roles`]: ['Admin'],
      },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('redirects users with no roles to /unauthorized', () => {
    useAuth0.mockReturnValue({
      isLoading: false,
      user: {
        email: 'test@example.com', // User with no roles claim
      },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
  });
});