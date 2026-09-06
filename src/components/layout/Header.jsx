import { useEffect, useState, forwardRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const CURRENT_USER_KEY = 'escapeCurrentUser';

const navLinks = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/planner', label: 'Planner' },
];

const getCurrentUser = () => {
  try {
    const storedUser = window.localStorage.getItem(CURRENT_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const Header = forwardRef(function Header(props, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const updateCurrentUser = () => setCurrentUser(getCurrentUser());
    const handleAuthChange = () => updateCurrentUser();

    window.addEventListener('storage', updateCurrentUser);
    window.addEventListener('auth-state-changed', handleAuthChange);
    updateCurrentUser();

    return () => {
      window.removeEventListener('storage', updateCurrentUser);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-state-changed'));
    navigate('/auth');
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-primary font-semibold border-b-2 border-primary'
      : 'text-gray-600 hover:text-primary';

  return (
    <header
      ref={ref}
      className="fixed top-0 left-0 right-0 z-40 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200"
      {...props}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label="ESCAPE - Home"
          onClick={closeMenu}
        >
          <svg
            className="w-7 h-7 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Compass icon"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon
              points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
              fill="currentColor"
            />
          </svg>
          <span className="font-bold text-xl text-primary">ESCAPE</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={getNavLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                {currentUser.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Log in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md py-4 px-6 transition-all duration-200 ease-in-out"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={getNavLinkClass}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={closeMenu}
                className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-dark"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
});

export default Header;
