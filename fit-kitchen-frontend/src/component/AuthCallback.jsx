import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateAuthState } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const hashParams = new URLSearchParams(location.hash.substring(1));
                const accessToken = hashParams.get('access_token');

                console.log('Processing callback with access token:', accessToken ? 'present' : 'missing');

                if (!accessToken) {
                    throw new Error('No access token received');
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ access_token: accessToken }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error?.message || 'Authentication failed');
                }

                // Set session dan update auth context
                if (data.data?.token && data.data?.user) {
                    updateAuthState(data.data.user, data.data.token);
                    toast.success('Successfully logged in with Google!');
                    navigate('/', { replace: true });
                } else {
                    throw new Error('Invalid response from server');
                }

            } catch (error) {
                console.error('Auth callback error:', error);
                setError(error.message);
                toast.error(error.message);
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [navigate, location, updateAuthState]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {error ? (
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
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Completing authentication...</p>
                </div>
            )}
        </div>
    );
}