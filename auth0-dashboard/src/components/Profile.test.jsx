import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Profile from './Profile';
import { useAuth0 } from '@auth0/auth0-react';

// Mock the useAuth0 hook
vi.mock('@auth0/auth0-react');

describe('Profile', () => {
  it('renders loading state correctly', () => {
    useAuth0.mockReturnValue({ isLoading: true });
    render(<Profile />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders nothing if not authenticated and not loading', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false, isLoading: false });
    const { container } = render(<Profile />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders user information when authenticated', () => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      picture: 'https://example.com/john.jpg',
    };
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      isLoading: false,
    });

    render(<Profile />);

    expect(screen.getByRole('img', { name: /john doe/i })).toHaveAttribute('src', user.picture);
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });
});