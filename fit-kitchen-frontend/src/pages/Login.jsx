import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            setErrors({
                submit: error.message || 'Login failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const origin = window.location.origin;
            // const callbackUrl = `${origin}/auth/callback`;
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Origin': origin
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!data.success || !data.data?.url) {
                throw new Error('Failed to get Google authentication URL');
            }
            
            window.location.href = data.data.url;
        } catch (error) {
            console.error('Google sign in error:', error);
            toast.error('Failed to initialize Google sign in');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box">
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                <h2 className="auth-title">Sign in to your account</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    {errors.submit && <div className="error-message">{errors.submit}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="separator">
                    <div className="separator-line"></div>
                    <span className="separator-text">Or continue with</span>
                    <div className="separator-line"></div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="social-button"
                >
                    <img src="/../../../google.svg" alt="Google" className="social-icon" />
                    Sign in with Google
                </button>

                <div className="auth-link-container">
                    <span className="auth-link-text">
                        Don't have an account?
                    </span>
                    <Link to="/register" className="auth-link">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}