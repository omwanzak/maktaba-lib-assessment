"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "reader" | "librarian" | "admin";
  borrowingLimit?: number;
  currentBorrowed?: number;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            // If token is invalid or expired, clear it and set user to null
            localStorage.removeItem('token');
            setUser(null);
            throw new Error('Session expired or invalid token');
          }
          return res.json();
        })
        .then((data) => {
          setUser(data); // Directly set data as user
        })
        .catch((err) => {
          console.error("Failed to fetch user on refresh:", err);
          setError(err.message || "Failed to restore session");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Route protection hook
export const useAuthGuard = (allowedRoles: Array<User["role"]>) => {
  const { user } = useAuth();
  return user && allowedRoles.includes(user.role);
};