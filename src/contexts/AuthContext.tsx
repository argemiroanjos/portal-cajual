"use client";

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  _id: string; name: string; lastName: string; email: string; role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get('/usuario/perfil');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    await api.post("/usuario/autenticacao", { email, password });
    await checkAuthStatus(); 
  };
  
  const logout = async () => {
    await api.post('/usuario/logout');
    setUser(null);
    toast.success("Você saiu com sucesso!");
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}