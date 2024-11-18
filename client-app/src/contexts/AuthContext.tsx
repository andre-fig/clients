import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/NavigationService';

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

  const login = useCallback(async (newToken: string) => {
    try {
      await AsyncStorage.setItem('access_token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      setToken(null);
      navigationRef.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
