import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionManager } from "../utils/session";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                
                if (!code) {
                    console.error('No authorization code received');
                    navigate('/login');
                    return;
                }

                // Ambil kode dari backend
                const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/auth/callback?code=${code}`);
                const data = await response.json();

                if (data.success) {
                    // Set session and navigate
                    sessionManager.setSession(data.token, data.user);
                    navigate('/', { replace: true });
                } else {
                    throw new Error(data.error?.message || 'Authentication failed');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, login]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
    );
}