"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockApi } from "./utils/mockApi";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await mockApi.login(email, password);
      // Ensure role is typed correctly
      setUser({
        ...loggedInUser,
        role: loggedInUser.role as "reader" | "librarian" | "admin"
      });
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
