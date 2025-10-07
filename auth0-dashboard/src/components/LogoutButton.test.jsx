import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogoutButton from './LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

// Mock the useAuth0 hook
vi.mock('@auth0/auth0-react');

describe('LogoutButton', () => {
  it('renders correctly', () => {
    const logout = vi.fn();
    useAuth0.mockReturnValue({ logout });

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: /log out/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('calls logout when clicked', () => {
    const logout = vi.fn();
    useAuth0.mockReturnValue({ logout });

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({ logoutParams: { returnTo: window.location.origin } });
  });
});