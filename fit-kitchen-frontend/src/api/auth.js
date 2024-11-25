import { sessionManager } from '../utils/session.js';
import api from './axios.js';

export const authAPI = {
    async login(credentials) {
        const response = await api.post('/api/auth/login', credentials);
        if (response.success) {
            sessionManager.setSession(response.data.token, response.data.user);
        }
        return response;
    },

    async register(userData) {
        const response = await api.post('/api/auth/register', userData);
        if (response.success) {
            sessionManager.setSession(response.data.token, response.data.user);
        }
        return response;
    },

    async logout() {
        try {
            await api.post('/api/auth/logout');
        } finally {
            sessionManager.clearSession();
        }
    },

    async googleSignIn() {
        const response = await api.get('/api/auth/google');
        return response.data.url;
    }
};