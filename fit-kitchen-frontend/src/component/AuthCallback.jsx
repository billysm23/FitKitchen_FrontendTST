import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionManager } from "../utils/session";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                
                console.log('URL Parameters:', Object.fromEntries(params.entries()));
                
                const code = params.get('code');
                const error = params.get('error');
                
                if (error) {
                    throw new Error(`Google OAuth error: ${error}`);
                }

                if (!code) {
                    throw new Error('No authorization code received from Google');
                }

                // Ambil kode dari backend
                const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/auth/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
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
                sessionManager.setSession(data.data.token, data.data.user);
                
                toast.success('Successfully logged in!');
                
                // Navigate ke home
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Auth callback error:', error);
                setError(error.message);
                toast.error(error.message);
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        handleCallback();
    }, [navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-red-700">{error}</p>
                    <p className="text-sm text-red-500 mt-2">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Authenticating...</p>
            </div>
        </div>
    );
}