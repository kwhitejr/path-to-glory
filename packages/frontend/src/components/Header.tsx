import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, loading, login, logout } = useAuth();

  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold md:text-2xl">Path to Glory</h1>
          </Link>

          {/* User Profile / Login */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary-600" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* User info - hidden on mobile, shown on desktop */}
                <div className="hidden text-right md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-primary-200">{user.email}</div>
                </div>

                {/* Profile picture */}
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-primary-500"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-500 bg-primary-600 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Logout button */}
                <button
                  onClick={logout}
                  className="rounded bg-primary-600 px-3 py-1.5 text-sm font-medium transition hover:bg-primary-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center space-x-2 rounded bg-white px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
