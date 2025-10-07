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

      // First check if we have a valid session
      const session = await fetchAuthSession();
      if (!session.tokens) {
        setUser(null);
        return;
      }

      const authUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      setUser(mapAuthUserToUser(authUser, attributes));
    } catch (err) {
      console.log('Load user error:', err);
      // User is not authenticated or session is invalid
      setUser(null);
      setError(null); // Not an error, just not logged in
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async () => {
    try {
      setError(null);

      // signInWithRedirect will redirect to Google OAuth
      // The page will reload after redirect, so no need to wait
      signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      console.error('Login error:', error);
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
