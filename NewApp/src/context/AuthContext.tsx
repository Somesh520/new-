import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define user type
export interface User {
  email: string;
  name?: string;
  role?: string;
  [key: string]: any; // Allow additional properties
}

// 1. Define the shape of the data and functions the context will provide.
interface AuthContextType {
  isUserLoggedIn: boolean;
  user: User | null;
  login: (userData?: any, keepLoggedIn?: boolean) => void;
  logout: () => void;
}

// 2. Create the actual context.
// It's created with 'undefined' initially because it will get its real value from the provider.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider component.
// This component will wrap your entire app and manage the login state.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Function to set the user as logged in
  const login = (userData?: any, keepLoggedIn?: boolean) => {
    // In a real app, you would handle user tokens here.
    console.log("User logged in!", { userData, keepLoggedIn });
    setIsUserLoggedIn(true);
    // Store user data if provided
    if (userData) {
      setUser(userData);
    }
  };

  // Function to set the user as logged out
  const logout = () => {
    console.log("User logged out!");
    setIsUserLoggedIn(false);
    setUser(null);
  };

  // The value object contains the state and functions that will be available to any child component.
  const value = { isUserLoggedIn, user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook for easy access.
// This makes it simple for other components to get the login state and functions.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error will appear if you try to use the context outside of the provider.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};