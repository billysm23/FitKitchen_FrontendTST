import api from './axios';

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.token) {
        localStorage.setItem('token', response.token);
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.token) {
        localStorage.setItem('token', response.token);
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    } catch (error) {
        throw error;
    }
};