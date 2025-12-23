"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null; // ✅ ถ้าไม่ได้ login → null
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // ✅ ค่าเริ่มต้นเป็น null

  const login = (username: string) => {
    setUser({ id: 1, username }); // mock login
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth ต้องใช้ภายใน AuthProvider");
  }
  return context;
};
