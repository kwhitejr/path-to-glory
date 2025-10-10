import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { client } from './lib/apollo-client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { configureAmplify } from './config/amplify';
import { useFavicon } from './hooks/useFavicon';
import Layout from './components/Layout';
import ArmyListPage from './pages/ArmyListPage';
import ArmyDetailPage from './pages/ArmyDetailPage';
import CreateArmyPage from './pages/CreateArmyPage';
import EditArmyPage from './pages/EditArmyPage';
import AddUnitPage from './pages/AddUnitPage';
import EditUnitPage from './pages/EditUnitPage';
import CampaignsPage from './pages/CampaignsPage';
import BattlesPage from './pages/BattlesPage';

// Configure Amplify on app initialization
configureAmplify();

// Component to handle root redirect with OAuth callback awareness
function RootRedirect() {
  const location = useLocation();
  const { loading } = useAuth();

  // Don't redirect if we have OAuth callback parameters
  // This allows Amplify to process the OAuth code before navigating
  const hasOAuthParams = location.search.includes('code=') || location.search.includes('error=');

  if (hasOAuthParams) {
    console.log('[App] OAuth callback detected, not redirecting');

    // Once auth loading is complete, redirect back to where user came from
    if (!loading) {
      // Try to get the original path from localStorage (set before OAuth redirect)
      const returnPath = localStorage.getItem('oauth_return_path') || '/armies';
      localStorage.removeItem('oauth_return_path');

      console.log('[App] OAuth processing complete, redirecting to:', returnPath);
      return <Navigate to={returnPath} replace />;
    }

    // Return a loading state while OAuth processes
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return <Navigate to="/armies" replace />;
}

// Inner component that has access to auth context
function AppContent() {
  const { user } = useAuth();

  // Update favicon based on authentication status
  useFavicon(!!user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RootRedirect />} />
          <Route path="armies" element={<ArmyListPage />} />
          <Route path="armies/new" element={<CreateArmyPage />} />
          <Route path="armies/:armyId" element={<ArmyDetailPage />} />
          <Route path="armies/:armyId/edit" element={<EditArmyPage />} />
          <Route path="armies/:armyId/units/new" element={<AddUnitPage />} />
          <Route path="armies/:armyId/units/:unitId/edit" element={<EditUnitPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="battles" element={<BattlesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <AppContent />
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
