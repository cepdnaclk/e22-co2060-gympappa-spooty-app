import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './pages/Login';
import App from './App';

const { mockLogin, mockGetProfile, mockVerifyFirebase } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockGetProfile: vi.fn(),
  mockVerifyFirebase: vi.fn(),
}));

vi.mock('./utils/api', () => ({
  authAPI: {
    login: mockLogin,
    verifyFirebase: mockVerifyFirebase,
    getProfile: mockGetProfile,
  },
}));

vi.mock('./config/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('Login page', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockLogin.mockReset();
    mockGetProfile.mockReset();
    mockVerifyFirebase.mockReset();
  });

  it('shows validation when the user leaves required fields blank', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const form = document.querySelector('.auth-form');
    fireEvent.submit(form);

    expect(await screen.findByText('Please enter both user ID and password')).toBeInTheDocument();
  });

  it('stores the session and navigates after a successful login', async () => {
    mockLogin.mockResolvedValue({
      data: {
        token: 'abc123',
        user: { userId: 'e22018', role: 'student', needsPasswordSetup: false },
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('User ID'), { target: { value: 'e22018' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      userId: 'e22018',
      password: 'secret123',
    }));

    await waitFor(() => {
      expect(sessionStorage.getItem('token')).toBe('abc123');
      expect(sessionStorage.getItem('user')).toContain('e22018');
    });
  });
});

describe('App routing', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockGetProfile.mockReset();
  });

  it('redirects unauthenticated users to the login page', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });
});
