import React, { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

/**
 * AuthProvider Context
 * 
 * Single source of truth for authentication state
 * Provides auth methods and current user data
 * 
 * Features:
 * - Auto-refresh user data
 * - Auth state change listeners
 * - Session persistence
 * - Offline-aware operations
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStateListeners, setAuthStateListeners] = useState([]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      notifyAuthStateChange(currentUser);
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const notifyAuthStateChange = (newUser) => {
    authStateListeners.forEach((listener) => {
      try {
        listener(newUser);
      } catch (error) {
        console.error("Auth state listener error:", error);
      }
    });
  };

  const onAuthChange = (callback) => {
    setAuthStateListeners((prev) => [...prev, callback]);
    return () => {
      setAuthStateListeners((prev) => prev.filter((cb) => cb !== callback));
    };
  };

  const loginEmail = async (email, password) => {
    if (!navigator.onLine) {
      throw new Error("You're offline. Please check your connection and try again.");
    }

    try {
      await base44.auth.loginWithEmail({ email, password });
      await loadUser();
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Check your email and password and try again.");
    }
  };

  const signupEmail = async ({ name, email, password }) => {
    if (!navigator.onLine) {
      throw new Error("You're offline. Please check your connection and try again.");
    }

    try {
      await base44.auth.signupWithEmail({
        full_name: name,
        email,
        password,
      });
      await loadUser();
      return { success: true, needsVerification: false };
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.message?.includes("already exists")) {
        throw new Error("An account with this email already exists.");
      }
      throw new Error("We couldn't complete that request. Please try again.");
    }
  };

  const loginGoogle = async () => {
    if (!navigator.onLine) {
      throw new Error("You're offline. Please check your connection and try again.");
    }

    try {
      await base44.auth.loginWithGoogle();
      await loadUser();
      return { success: true };
    } catch (error) {
      console.error("Google login failed:", error);
      if (error.message?.includes("cancelled")) {
        throw new Error("Sign-in was cancelled.");
      }
      throw new Error("Couldn't sign in with Google. Please try again.");
    }
  };

  const requestPasswordReset = async (email) => {
    if (!navigator.onLine) {
      throw new Error("You're offline. Please check your connection and try again.");
    }

    try {
      await base44.auth.requestPasswordReset({ email });
      return { success: true };
    } catch (error) {
      console.error("Password reset request failed:", error);
      // Don't reveal if account exists (security)
      return { success: true };
    }
  };

  const resetPassword = async (token, newPassword) => {
    if (!navigator.onLine) {
      throw new Error("You're offline. Please check your connection and try again.");
    }

    try {
      await base44.auth.resetPassword({ token, new_password: newPassword });
      return { success: true };
    } catch (error) {
      console.error("Password reset failed:", error);
      throw new Error("The reset link is invalid or expired. Please request a new one.");
    }
  };

  const resendVerificationEmail = async () => {
    if (!navigator.onLine) {
      throw new Error("You're offline. Please check your connection and try again.");
    }

    try {
      await base44.auth.resendVerificationEmail();
      return { success: true };
    } catch (error) {
      console.error("Resend verification failed:", error);
      throw new Error("Couldn't resend verification email. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await base44.auth.logout();
      setUser(null);
      notifyAuthStateChange(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout on client even if server call fails
      setUser(null);
      notifyAuthStateChange(null);
    }
  };

  const updateMe = async (data) => {
    try {
      await base44.auth.updateMe(data);
      await loadUser();
      return { success: true };
    } catch (error) {
      console.error("Update profile failed:", error);
      throw new Error("Failed to update profile. Please try again.");
    }
  };

  const me = () => user;

  const value = {
    user,
    loading,
    me,
    loginEmail,
    signupEmail,
    loginGoogle,
    requestPasswordReset,
    resetPassword,
    resendVerificationEmail,
    logout,
    updateMe,
    onAuthChange,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
