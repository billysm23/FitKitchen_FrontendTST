import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

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
        <div className={styles.auth_callback_container}>
            {error ? (
                <div className={styles.auth_callback_wrapper}>
                    <div className={`${styles.error_card} ${styles['fade-in']}`}>
                        <div className={styles.error_icon_container}>
                            <svg 
                                className={styles.error_icon} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                        <h3 className={styles.error_title}>
                            Authentication Error
                        </h3>
                        <p className={styles.error_message}>{error}</p>
                        <p className={styles.redirect_message}>
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            ) : (
                <div className={`${styles.loading_container} ${styles['fade-in']}`}>
                    <div className={styles.loading_spinner}></div>
                    <p className={styles.loading_text}>Completing authentication...</p>
                </div>
            )}
        </div>
    );
}