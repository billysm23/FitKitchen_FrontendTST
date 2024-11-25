import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add axios interceptor for token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/verify')
        .then(response => {
          if (response.data.success) {
            setCurrentUser(response.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    }
  };

  const register = async (username, email, password) => {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password
    });
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}