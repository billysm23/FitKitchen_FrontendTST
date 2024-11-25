import axios from 'axios';
import ApiError from '../utils/errorHandler.js';
import { sessionManager } from '../utils/session.js';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const session = sessionManager.getSession();
        if (session?.token) {
            config.headers.Authorization = `Bearer ${session.token}`;
        }
        return config;
    },
    (error) => Promise.reject(ApiError.handle(error))
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const processedError = ApiError.handle(error);
        
        if (processedError.action === 'login') {
            sessionManager.clearSession();
            window.location.href = '/login';
        }
        
        return Promise.reject(processedError);
    }
);

export default api;