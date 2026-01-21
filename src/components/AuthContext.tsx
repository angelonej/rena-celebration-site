import React, { useEffect, useState, createContext, useContext, memo } from 'react';
interface User {
  id: string;
  email: string;
  name: string;
  role: 'family' | 'friend' | 'admin';
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('memorial_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - in production, this would call a backend API
    // For demo purposes, accept any email with password "rena2025"
    if (password === 'rena2025') {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'friend'
      };
      setUser(newUser);
      localStorage.setItem('memorial_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('memorial_user');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isAuthenticated: !!user
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}