import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Debug log
                console.log('Current URL:', window.location.href);
                console.log('Search params:', location.search);
                console.log('Hash params:', location.hash);

                const searchParams = new URLSearchParams(location.search);
                const hashParams = new URLSearchParams(location.hash.substring(1));

                const code = searchParams.get('code') || hashParams.get('code');
                const error = searchParams.get('error') || hashParams.get('error');
                
                console.log('All search parameters:', Object.fromEntries(searchParams.entries()));
                console.log('All hash parameters:', Object.fromEntries(hashParams.entries()));

                if (error) {
                    throw new Error(`Google OAuth error: ${error}`);
                }

                if (!code) {
                    throw new Error('No authorization code received from Google');
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/callback?code=${code}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to authenticate');
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error?.message || 'Authentication failed');
                }

                // Set session
                if (data.data?.token && data.data?.user) {
                    sessionStorage.setItem('token', data.data.token);
                    sessionStorage.setItem('user', JSON.stringify(data.data.user));
                    
                    toast.success('Successfully logged in!');
                    
                    // Navigate ke home
                    navigate('/', { replace: true });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                setError(error.message);
                toast.error(error.message);
                
                // Log debug info
                console.log('Environment:', process.env.NODE_ENV);
                console.log('API URL:', process.env.REACT_APP_API_URL);
                
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [navigate, location]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-6">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center justify-center text-red-600 mb-4">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-center text-gray-900 mb-2">
                            Authentication Error
                        </h3>
                        <p className="text-gray-600 text-center mb-4">{error}</p>
                        <p className="text-sm text-gray-500 text-center">
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
}