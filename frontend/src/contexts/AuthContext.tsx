import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'motoboy' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to load user from localStorage on init
    const savedUser = localStorage.getItem('mototrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication logic
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === '123456') {
          const adminUser: User = { id: 'admin-1', name: 'Administrador', role: 'admin' };
          setUser(adminUser);
          localStorage.setItem('mototrack_user', JSON.stringify(adminUser));
          resolve(true);
        } else if (username === 'motoboy' && password === '123') {
          const motoboyUser: User = { id: 'moto-1', name: 'Carlos Motoboy', role: 'motoboy' };
          setUser(motoboyUser);
          localStorage.setItem('mototrack_user', JSON.stringify(motoboyUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 600); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mototrack_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
