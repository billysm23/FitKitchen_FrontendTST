import { AlertCircle, Eye, EyeOff, LogIn, Mail } from 'lucide-react';
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
    const [showPassword, setShowPassword] = useState(false);

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
            <div className="auth-wrapper">
                <div className="auth-card">
                    {loading && (
                        <div className="auth-loading-overlay">
                            <div className="auth-loading-spinner" />
                        </div>
                    )}

                    <h2 className="auth-title">Welcome Back</h2>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <Mail size={16} />
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`auth-field-input ${errors.email ? 'error' : ''}`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <span className="auth-error-message">
                                    <AlertCircle size={14} />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <LogIn size={16} />
                                Password
                            </label>
                            <div className="auth-input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`auth-field-input ${errors.password ? 'error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="auth-input-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="auth-error-message">
                                    <AlertCircle size={14} />
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="auth-error-message">
                                <AlertCircle size={14} />
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-button"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="auth-separator">
                        <div className="auth-separator-line" />
                        <span className="auth-separator-text">Or continue with</span>
                        <div className="auth-separator-line" />
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="auth-social-button"
                    >
                        <img src="/google.svg" alt="Google" className="auth-social-icon" />
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
        </div>
    );
}