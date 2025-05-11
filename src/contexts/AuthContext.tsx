
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  points: number;
  level: number;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@taskmanager.com",
    name: "Admin User",
    role: "admin",
    points: 1500,
    level: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@taskmanager.com",
    name: "Demo User",
    role: "user",
    points: 750,
    level: 3,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("taskManagerUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === "password") { // Simple mock password
        localStorage.setItem("taskManagerUser", JSON.stringify(foundUser));
        setUser(foundUser);
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (MOCK_USERS.some(u => u.email === email)) {
        toast.error("Email already in use. Please try another email.");
        return;
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "user",
        points: 0,
        level: 1,
        createdAt: new Date().toISOString(),
      };
      
      // Normally we would make an API call here
      localStorage.setItem("taskManagerUser", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("taskManagerUser");
    setUser(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
