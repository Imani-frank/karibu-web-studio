import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Branch } from '@/types/karibu';

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole, branch: Branch) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: UserRole, branch: Branch) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      role,
      branch,
      contact: '+256 700 000 000',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
