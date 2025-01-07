import { AlertCircle, Check, Eye, EyeOff, Key, Lock, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRequirements = [
        { label: 'At least 6 characters', test: pwd => pwd.length >= 6 },
        { label: 'One uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
        { label: 'One lowercase letter', test: pwd => /[a-z]/.test(pwd) },
        { label: 'One number', test: pwd => /\d/.test(pwd) },
        { label: 'One special character', test: pwd => /[@#^_()\[\]$!%*?&]/.test(pwd) }
    ];

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

    const validateForm = () => {
        const newErrors = {};

        // Current password validation
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        // New password validation
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        } else {
            const failedRequirements = passwordRequirements.filter(req => !req.test(formData.newPassword));
            if (failedRequirements.length > 0) {
                newErrors.newPassword = 'New password does not meet all requirements';
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPasswordStrength = () => {
        if (!formData.newPassword) return '';
        const passedRequirements = passwordRequirements.filter(req => req.test(formData.newPassword));
        if (passedRequirements.length <= 2) return 'weak';
        if (passedRequirements.length <= 4) return 'medium';
        return 'strong';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            await api.put('/api/auth/update-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            
            toast.success('Password updated successfully. Please login again with your new password.');
            
            setTimeout(async () => {
                await logout();
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Error updating password:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update password';
            toast.error(errorMessage);
            
            if (error.response?.data?.field) {
                setErrors(prev => ({
                    ...prev,
                    [error.response.data.field]: errorMessage
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-change-page">
            <div className="password-change-wrapper">
                <div className="password-change-card">
                    {loading && (
                        <div className="password-loading-overlay">
                            <div className="password-loading-spinner" />
                        </div>
                    )}

                    <h2 className="password-change-title">Change Your Password</h2>
                    
                    <form onSubmit={handleSubmit} className="password-change-form">
                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <Key size={16} />
                                Current Password
                            </label>
                            <div className="auth-input-group">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className={`auth-field-input ${errors.currentPassword ? 'error' : ''}`}
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    className="auth-input-icon"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <span className="auth-error-message">
                                    <AlertCircle size={14} />
                                    {errors.currentPassword}
                                </span>
                            )}
                        </div>

                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <Lock size={16} />
                                New Password
                            </label>
                            <div className="auth-input-group">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`auth-field-input ${errors.newPassword ? 'error' : ''}`}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    className="auth-input-icon"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {formData.newPassword && (
                                <div className="auth-strength-indicator">
                                    <div className={`auth-strength-bar auth-strength-${getPasswordStrength()}`} />
                                </div>
                            )}

                            <ul className="auth-requirements-list">
                                {passwordRequirements.map((req, index) => (
                                    <li 
                                        key={index}
                                        className={`auth-requirement-item ${
                                            !formData.newPassword ? '' :
                                            req.test(formData.newPassword) ? 'auth-requirement-valid' : 'auth-requirement-invalid'
                                        }`}
                                    >
                                        {formData.newPassword ? (
                                            req.test(formData.newPassword) ? <Check size={12} /> : <X size={12} />
                                        ) : <div style={{ width: 12 }} />}
                                        {req.label}
                                    </li>
                                ))}
                            </ul>

                            {errors.newPassword && (
                                <span className="auth-error-message">
                                    <AlertCircle size={14} />
                                    {errors.newPassword}
                                </span>
                            )}
                        </div>

                        <div className="auth-field-group">
                            <label className="auth-field-label">
                                <Lock size={16} />
                                Confirm New Password
                            </label>
                            <div className="auth-input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`auth-field-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your new password"
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

                        <div className="password-change-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/profile/edit')}
                                className="password-change-button password-cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="password-change-button password-submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;