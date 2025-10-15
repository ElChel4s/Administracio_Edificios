import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { apiService, User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithToken: (token: string, user: User) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await apiService.getMe();
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      // Si falla, hacer logout
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await apiService.login({ email, password });
    
    if (response.success && response.token && response.user) {
      setToken(response.token);
      setUser(response.user);
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    } else {
      throw new Error(response.message || 'Error en el login');
    }
  }, []);

  const signInWithToken = useCallback((token: string, user: User) => {
    setToken(token);
    setUser(user);
    
    // Guardar en localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Intentar hacer logout en el servidor
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar estado local independientemente del resultado del servidor
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }, [token]);

  // Inicializar el estado desde localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verificar si el token sigue siendo válido
          await refreshProfile();
        } catch (error) {
          console.error('Error loading stored auth data:', error);
          // Si hay error, limpiar el localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [refreshProfile]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    signIn,
    signInWithToken,
    signOut,
    refreshProfile,
  }), [user, token, loading, signIn, signInWithToken, signOut, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
