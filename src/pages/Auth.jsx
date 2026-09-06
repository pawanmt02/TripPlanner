import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ACCOUNTS_KEY = 'escapeAccounts';
const CURRENT_USER_KEY = 'escapeCurrentUser';

const getStoredAccounts = () => {
  try {
    const rawValue = window.localStorage.getItem(ACCOUNTS_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch {
    return [];
  }
};

const getStoredCurrentUser = () => {
  try {
    const rawValue = window.localStorage.getItem(CURRENT_USER_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
};

function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = useMemo(() => getStoredCurrentUser(), []);

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const accounts = getStoredAccounts();
    const normalizedEmail = form.email.trim().toLowerCase();
    const matchingUser = accounts.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === form.password
    );

    if (!matchingUser) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    const userSession = {
      id: matchingUser.id,
      name: matchingUser.name,
      email: matchingUser.email,
    };

    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
    window.dispatchEvent(new Event('auth-state-changed'));
    setSuccess(`Welcome back, ${matchingUser.name}!`);

    window.setTimeout(() => {
      navigate('/');
    }, 350);
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !form.password) {
      setError('Please complete all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const accounts = getStoredAccounts();
    const existingAccount = accounts.some(
      (account) => account.email.toLowerCase() === trimmedEmail
    );

    if (existingAccount) {
      setError('An account with this email already exists.');
      return;
    }

    const newAccount = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      password: form.password,
    };

    const updatedAccounts = [...accounts, newAccount];
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    window.localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({ id: newAccount.id, name: newAccount.name, email: newAccount.email })
    );
    window.dispatchEvent(new Event('auth-state-changed'));

    setSuccess('Account created successfully');
    setForm({ name: '', email: '', password: '', confirmPassword: '' });

    window.setTimeout(() => {
      navigate('/');
    }, 350);
  };

  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 text-white shadow-lg">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/80">Welcome to ESCAPE</p>
          <h1 className="text-4xl font-bold">Plan smarter weekend escapes.</h1>
          <p className="mt-4 max-w-md text-white/80">
            Save your favorite destinations, keep your itineraries organized, and track your spending in one beautiful planner.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-white/80">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <span aria-hidden="true">✈️</span>
              <span>Build custom trip plans in minutes</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <span aria-hidden="true">💸</span>
              <span>Monitor budget across every day of travel</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <span aria-hidden="true">🧭</span>
              <span>Keep each getaway organized and effortless</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 inline-flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              aria-label="Login tab"
              onClick={() => setMode('login')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              aria-label="Create account tab"
              onClick={() => setMode('signup')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'signup' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
              }`}
            >
              Create account
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          )}

          {currentUser && mode === 'login' && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              You are already signed in as {currentUser.name}.
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <Button type="submit" className="w-full" size="lg">
                Log in
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
              />
              <Button type="submit" className="w-full" size="lg">
                Sign up
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Need a quick trip idea?{' '}
            <Link to="/explore" className="font-semibold text-primary hover:underline">
              Explore destinations
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
