import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  AuthUser,
  FetchUserAttributesOutput,
  fetchAuthSession,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function mapAuthUserToUser(
  authUser: AuthUser,
  attributes: FetchUserAttributesOutput
): User {
  return {
    id: authUser.userId,
    email: attributes.email || '',
    name: attributes.name || '',
    picture: attributes.picture,
    username: authUser.username,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[AuthContext] Loading user...');
      console.log('[AuthContext] Current URL:', window.location.href);
      console.log('[AuthContext] URL has OAuth params:', window.location.href.includes('code='));

      // First check if we have a valid session
      const session = await fetchAuthSession();
      console.log('[AuthContext] Session check:', {
        hasTokens: !!session.tokens,
        hasIdToken: !!session.tokens?.idToken,
        hasAccessToken: !!session.tokens?.accessToken,
      });

      if (!session.tokens) {
        console.log('[AuthContext] No valid tokens in session');
        setUser(null);
        return;
      }

      const authUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      console.log('[AuthContext] User loaded successfully:', {
        userId: authUser.userId,
        email: attributes.email,
        name: attributes.name,
        hasPicture: !!attributes.picture
      });

      const mappedUser = mapAuthUserToUser(authUser, attributes);
      setUser(mappedUser);
      console.log('[AuthContext] Loading complete. User: logged in');
    } catch (err: any) {
      console.error('[AuthContext] Load user error:', {
        name: err?.name,
        message: err?.message,
        error: err,
      });

      // If error is about already being authenticated, try to sign out and retry
      if (err?.name === 'UserAlreadyAuthenticatedException') {
        console.log('[AuthContext] Clearing stale session...');
        try {
          await signOut();
          setUser(null);
        } catch (signOutErr) {
          console.error('[AuthContext] Failed to clear session:', signOutErr);
        }
      }

      setUser(null);
      setError(null); // Not an error, just not logged in
      console.log('[AuthContext] Loading complete. User: not logged in');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for auth events (sign in, sign out, token refresh)
    const hubListener = Hub.listen('auth', ({ payload }) => {
      console.log('[AuthContext] Hub event:', payload.event, payload);

      switch (payload.event) {
        case 'signInWithRedirect':
          console.log('[AuthContext] OAuth redirect completed');
          loadUser();
          break;
        case 'signInWithRedirect_failure':
          console.error('[AuthContext] OAuth redirect failed:', payload.data);
          setError(new Error('OAuth sign-in failed'));
          setLoading(false);
          break;
        case 'tokenRefresh':
          console.log('[AuthContext] Token refreshed');
          loadUser();
          break;
        case 'signedOut':
          console.log('[AuthContext] User signed out');
          setUser(null);
          break;
        case 'customOAuthState':
          console.log('[AuthContext] Custom OAuth state received');
          break;
        default:
          console.log('[AuthContext] Unhandled Hub event:', payload.event);
      }
    });

    return () => hubListener();
  }, []);

  const login = async () => {
    try {
      setError(null);
      console.log('[AuthContext] Initiating login from:', window.location.href);
      console.log('[AuthContext] Current origin:', window.location.origin);

      // Save current path to return to after OAuth
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('oauth_return_path', currentPath);
      console.log('[AuthContext] Saved return path:', currentPath);

      // Clear any stale OAuth state before initiating new flow
      // This prevents "different origin" errors
      try {
        await signOut({ global: false });
      } catch (e) {
        // Ignore errors if not signed in
        console.log('[AuthContext] Pre-login cleanup (expected if not signed in)');
      }

      console.log('[AuthContext] Calling signInWithRedirect...');

      // signInWithRedirect will redirect to Google OAuth
      // The page will reload after redirect, so no need to wait
      await signInWithRedirect({ provider: 'Google' });

      console.log('[AuthContext] signInWithRedirect completed (should not see this)');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      console.error('[AuthContext] Login error:', error);
      setError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      setError(error);
      throw error;
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
