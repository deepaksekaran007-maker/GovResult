import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoUser: (type: 'student1' | 'student2' | 'admin') => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('govresult_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveAuthData = (data: AuthResponse) => {
    localStorage.setItem('govresult_token', data.access_token);
    setToken(data.access_token);
    setUser({
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_active: true,
      registration_number: data.registration_number,
      student_id: data.student_id
    });
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('govresult_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const userData = await api.getMe();
      if (userData) {
        setUser(userData);
      } else {
        localStorage.removeItem('govresult_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const res: AuthResponse = await api.login(credentials);
      saveAuthData(res);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res: AuthResponse = await api.register(data);
      saveAuthData(res);
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = async (type: 'student1' | 'student2' | 'admin') => {
    setIsLoading(true);
    try {
      const res: AuthResponse = await api.demoLogin(type);
      saveAuthData(res);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('govresult_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
