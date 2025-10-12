import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with authentication */}
      <Header />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Fade indicators for scrollable content */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden"></div>

            {/* Scrollable nav container */}
            <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide snap-x snap-mandatory scroll-smooth">
              <NavLink to="/armies" active={location.pathname.startsWith('/armies')}>
                Armies
              </NavLink>
              <NavLink to="/warscrolls" active={location.pathname.startsWith('/warscrolls')}>
                Warscrolls
              </NavLink>
              <NavLink to="/campaigns" active={location.pathname.startsWith('/campaigns')}>
                Campaigns
              </NavLink>
              <NavLink to="/battles" active={location.pathname.startsWith('/battles')}>
                Battles
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {loading ? <SkeletonLoader /> : <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          <p>Path to Glory Tracker • Age of Sigmar</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors snap-start ${
        active
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Filters skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-100 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-gray-100 rounded w-20"></div>
              <div className="h-4 bg-gray-100 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
