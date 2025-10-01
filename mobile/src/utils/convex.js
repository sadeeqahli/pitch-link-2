// Convex client integration for the mobile app
import { ConvexReactClient } from "convex/react";
import { AuthProvider } from "convex/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// Create Convex client
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || "http://localhost:3001"
);

// Auth context for managing user authentication
const AuthContext = createContext();

// Auth provider component
export const ConvexAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("convex_token");
        if (token) {
          // Set the token in Convex client
          convex.setAuth(token);
          setIsAuthenticated(true);
          
          // Fetch user data
          // This would be replaced with actual Convex query
          setUser({ id: "user_id", name: "Owner Name", email: "owner@example.com" });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      // This would call the Convex signIn mutation
      // const userId = await convex.mutation("auth:signIn", { email, password });
      
      // For now, simulate successful login
      const token = "mock_token_" + Date.now();
      await SecureStore.setItemAsync("convex_token", token);
      convex.setAuth(token);
      setIsAuthenticated(true);
      setUser({ id: "user_id", name: "Owner Name", email });
      
      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: error.message };
    }
  };

  // Sign up function
  const signUp = async (name, email, password, phone) => {
    try {
      // This would call the Convex signUp mutation
      // const userId = await convex.mutation("auth:signUp", { name, email, password, phone });
      
      // For now, simulate successful signup
      const token = "mock_token_" + Date.now();
      await SecureStore.setItemAsync("convex_token", token);
      convex.setAuth(token);
      setIsAuthenticated(true);
      setUser({ id: "user_id", name, email, phone });
      
      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: error.message };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // This would call the Convex signOut mutation
      // await convex.mutation("auth:signOut");
      
      // Clear token from storage
      await SecureStore.deleteItemAsync("convex_token");
      convex.clearAuth();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      <AuthProvider client={convex}>{children}</AuthProvider>
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useConvexAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useConvexAuth must be used within a ConvexAuthProvider");
  }
  return context;
};

// Export the Convex client for direct usage
export default convex;