import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import { sessionManager } from '../utils/session';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const session = sessionManager.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      setCurrentUser(response.data.user);
      toast.success('Successfully logged in!');
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.register({ username, email, password });
      setCurrentUser(response.data.user);
      toast.success('Successfully registered!');
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      setCurrentUser(null);
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    initialized
  };

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}