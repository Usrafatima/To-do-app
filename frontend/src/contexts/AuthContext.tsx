// frontend/src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCurrentUser, getToken, removeToken } from '@/lib/apiClient';

interface User {
  name: string;
  email: string;
  profile_picture_url: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);


  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    removeToken();
    console.log("Logging out from AuthContext...");
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
