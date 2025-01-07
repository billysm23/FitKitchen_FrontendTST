import { AlertCircle, Check, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
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
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const passwordRequirements = [
        { label: 'At least 6 characters', test: pwd => pwd.length >= 6 },
        { label: 'One uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
        { label: 'One lowercase letter', test: pwd => /[a-z]/.test(pwd) },
        { label: 'One number', test: pwd => /\d/.test(pwd) },
        { label: 'One special character', test: pwd => /[@$!%*?&]/.test(pwd) }
    ];

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
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
            if (failedRequirements.length > 0) {
                newErrors.password = 'Password does not meet all requirements';
            }
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPasswordStrength = () => {
        if (!formData.password) return '';
        const passedRequirements = passwordRequirements.filter(req => req.test(formData.password));
        if (passedRequirements.length <= 2) return 'weak';
        if (passedRequirements.length <= 4) return 'medium';
        return 'strong';
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
    
                    <h2 className="auth-title">Create your account</h2>
    
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <User size={16} />
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`auth-field-input ${errors.username ? 'error' : ''}`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <span className="auth-error-message">
                                    <AlertCircle size={14} />
                                    {errors.username}
                                </span>
                            )}
                        </div>
    
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
                                <Lock size={16} />
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
                            
                            {formData.password && (
                                <div className="auth-strength-indicator">
                                    <div className={`auth-strength-bar auth-strength-${getPasswordStrength()}`} />
                                </div>
                            )}
    
                            <ul className="auth-requirements-list">
                                {passwordRequirements.map((req, index) => (
                                    <li 
                                        key={index}
                                        className={`auth-requirement-item ${
                                            !formData.password ? '' :
                                            req.test(formData.password) ? 'auth-requirement-valid' : 'auth-requirement-invalid'
                                        }`}
                                    >
                                        {formData.password ? (
                                            req.test(formData.password) ? <Check size={12} /> : <X size={12} />
                                        ) : <div style={{ width: 12 }} />}
                                        {req.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
    
                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <Lock size={16} />
                                Confirm Password
                            </label>
                            <div className="auth-input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`auth-field-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="auth-input-icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="auth-error-message">
                                    <AlertCircle size={14} />
                                    {errors.confirmPassword}
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
                            {loading ? 'Creating account...' : 'Create account'}
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
                        Sign up with Google
                    </button>
    
                    <p className="auth-terms">
                        By signing up, you agree to our{' '}
                        <Link to="/terms" className="auth-terms-link">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="auth-terms-link">Privacy Policy</Link>
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
        </div>
    );
};