import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import AuthPage from '../pages/Auth';

describe('AuthPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('creates a new account from the sign-up form', async () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jane Traveler' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });

    const savedAccounts = JSON.parse(window.localStorage.getItem('escapeAccounts') || '[]');
    expect(savedAccounts).toHaveLength(1);
    expect(savedAccounts[0].email).toBe('jane@example.com');
  });

  it('logs in an existing user with stored credentials', async () => {
    window.localStorage.setItem(
      'escapeAccounts',
      JSON.stringify([
        {
          id: 'user-1',
          name: 'Sam Traveler',
          email: 'sam@example.com',
          password: 'secret123',
        },
      ])
    );

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'sam@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome back, sam traveler/i)).toBeInTheDocument();
    });
  });
});
