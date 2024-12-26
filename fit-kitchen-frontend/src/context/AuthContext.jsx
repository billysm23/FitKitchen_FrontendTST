import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { sessionManager } from '../utils/session';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const session = sessionManager.getSession();
                if (session?.user) {
                    setCurrentUser(session.user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const updateAuthState = (userData, token) => {
        sessionManager.setSession(token, userData);
        setCurrentUser(userData);
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'Login failed');
            }

            updateAuthState(data.data.user, data.data.token);
            toast.success('Successfully logged in!');
            
            return data;
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'Registration failed');
            }

            updateAuthState(data.data.user, data.data.token);
            toast.success('Registration successful!');
            
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const session = sessionManager.getSession();
            if (session?.token) {
                await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.token}`
                    },
                    credentials: 'include'
                });
            }
            
            sessionManager.clearSession();
            setCurrentUser(null);
            toast.success('Successfully logged out');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading,
        updateAuthState
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}