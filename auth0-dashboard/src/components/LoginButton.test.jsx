import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginButton from './LoginButton';
import { useAuth0 } from '@auth0/auth0-react';

// Mock the useAuth0 hook
vi.mock('@auth0/auth0-react');

describe('LoginButton', () => {
  it('renders correctly', () => {
    const loginWithRedirect = vi.fn();
    useAuth0.mockReturnValue({ loginWithRedirect });

    render(<LoginButton />);

    const loginButton = screen.getByRole('button', { name: /log in/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('calls loginWithRedirect when clicked', () => {
    const loginWithRedirect = vi.fn();
    useAuth0.mockReturnValue({ loginWithRedirect });

    render(<LoginButton />);

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    expect(loginWithRedirect).toHaveBeenCalledTimes(1);
  });
});