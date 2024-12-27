import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const validatePassword = (password) => {
        const requirements = {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password),
        };

        return {
            isValid: Object.values(requirements).every(Boolean),
            requirements
        };
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 6 || formData.username.length > 30) {
            newErrors.username = 'Username must be between 6 and 30 characters';
        } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, dots, underscores, and hyphens';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        const { isValid, requirements } = validatePassword(formData.password);
        if (!isValid) {
            newErrors.password = 'Password does not meet requirements';
            newErrors.passwordRequirements = requirements;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPasswordStrength = (password) => {
        const { requirements } = validatePassword(password);
        const validCount = Object.values(requirements).filter(Boolean).length;
        
        if (validCount <= 2) return 'weak';
        if (validCount <= 4) return 'medium';
        return 'strong';
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
            await register(formData.username, formData.email, formData.password);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            setErrors({
                submit: error.message || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const origin = window.location.origin;
            const callbackUrl = `${origin}/auth/callback`;
            
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

                <h2 className="auth-title">Create your account</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className={`form-input ${errors.username ? 'error' : ''}`}
                            placeholder="Enter your username"
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>

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
                        <div className="input-group">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••"
                            />
                            <div 
                                className="input-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        
                        {formData.password && (
                            <div className="strength-indicator">
                                <div className={`strength-bar strength-${getPasswordStrength(formData.password)}`} />
                            </div>
                        )}

                        <ul className="requirements-list">
                            <li className={`requirement-item ${formData.password.length >= 6 ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
                                At least 6 characters
                            </li>
                            <li className={`requirement-item ${/[A-Z]/.test(formData.password) ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
                                One uppercase letter
                            </li>
                            <li className={`requirement-item ${/[a-z]/.test(formData.password) ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
                                One lowercase letter
                            </li>
                            <li className={`requirement-item ${/\d/.test(formData.password) ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
                                One number
                            </li>
                            <li className={`requirement-item ${/[@$!%*?&]/.test(formData.password) ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
                                One special character (@$!%*?&)
                            </li>
                        </ul>
                    </div>

                    {errors.submit && <div className="error-message">{errors.submit}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
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
                    <img src="/google.svg" alt="Google" className="social-icon" />
                    Sign up with Google
                </button>

                <p className="terms-text">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="terms-link">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </p>

                <div className="auth-link-container">
                    <span className="auth-link-text">
                        Already have an account?
                    </span>
                    <Link to="/login" className="auth-link">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}