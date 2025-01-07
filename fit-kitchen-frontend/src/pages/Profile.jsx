import { Activity, Book, Calculator, Edit2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import { sessionManager } from '../utils/session';

const Profile = () => {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const session = sessionManager.getSession();
                if (!session?.token) {
                    throw new Error('No authentication token found');
                }
        
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
                    headers: {
                        'Authorization': `Bearer ${session.token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'  // Penting untuk cookies
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
        
                if (data.success) {
                    setProfileData(data.data);
                } else {
                    throw new Error(data.error?.message || 'Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Profile fetch error details:', {
                    message: error.message,
                    stack: error.stack
                });
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Header Section */}
                <div className="profile-header">
                    <h1 className="profile-title">Profile</h1>
                    <Link to="/profile/edit" className="green-button">
                        <Edit2 size={16} />
                        Edit Profile
                    </Link>
                </div>
                
                {/* Personal Information */}
                <div className="section">
                    <div className="section-header">
                        <User className="section-icon" />
                        <h2 className="section-title">Personal Information</h2>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <p className="info-label">Username</p>
                            <p className="info-value">{currentUser?.username}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Email</p>
                            <p className="info-value">{currentUser?.email}</p>
                        </div>
                    </div>
                </div>

                {profileData?.healthAssessment ? (
                    <>
                        {/* Health Assessment Data */}
                        <div className="section">
                            <div className="section-header">
                                <Activity className="section-icon" />
                                <h2 className="section-title">Health Assessment</h2>
                            </div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <p className="info-label">Height</p>
                                    <p className="info-value">{profileData.healthAssessment.height} cm</p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Weight</p>
                                    <p className="info-value">{profileData.healthAssessment.weight} kg</p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Age</p>
                                    <p className="info-value">{profileData.healthAssessment.age} years</p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Gender</p>
                                    <p className="info-value">{profileData.healthAssessment.gender}</p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Activity Level</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.activity_level.replace('_', ' ')}
                                    </p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Health Goal</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.health_goal.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Health History */}
                        <div className="section">
                            <div className="section-header">
                                <Book className="section-icon" />
                                <h2 className="section-title">Health History</h2>
                            </div>
                            <div className="health-history">
                                <div className="info-item">
                                    <p className="info-label">Allergies</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.health_history.allergies.length > 0
                                            ? profileData.healthAssessment.health_history.allergies.join(', ')
                                            : 'None reported'}
                                    </p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Medical Conditions</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.health_history.medicalConditions.length > 0
                                            ? profileData.healthAssessment.health_history.medicalConditions.join(', ')
                                            : 'None reported'}
                                    </p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Medications</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.health_history.medications || 'None reported'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Calculations & Metrics */}
                        <div className="section">
                            <div className="section-header">
                                <Calculator className="section-icon" />
                                <h2 className="section-title">Nutritional Metrics</h2>
                            </div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <p className="info-label">BMI</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.metrics.bmi} 
                                        ({profileData.healthAssessment.metrics.bmi_category})
                                    </p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">BMR (Basal Metabolic Rate)</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.metrics.bmr} calories/day
                                    </p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">TDEE (Total Daily Energy Expenditure)</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.metrics.tdee} calories per day
                                    </p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Daily Calorie Target</p>
                                    <p className="info-value">
                                        {profileData.healthAssessment.metrics.final_cal} calories
                                    </p>
                                </div>
                            </div>

                            {/* Macronutrient Breakdown */}
                            <div className="macro-grid">
                                <div className="macro-card protein">
                                    <p className="macro-label">Protein</p>
                                    <p className="macro-value">
                                        {profileData.healthAssessment.metrics.macronutrients.protein}g
                                        {/* <span className="macro-percentage">
                                            ({profileData.healthAssessment.metrics.macronutrients.protein.percentage}%)
                                        </span> */}
                                    </p>
                                </div>
                                <div className="macro-card carbs">
                                    <p className="macro-label">Carbs</p>
                                    <p className="macro-value">
                                        {profileData.healthAssessment.metrics.macronutrients.carbs}g
                                        {/* <span className="macro-percentage">
                                            ({profileData.healthAssessment.metrics.macronutrients.carbs.percentage}%)
                                        </span> */}
                                    </p>
                                </div>
                                <div className="macro-card fats">
                                    <p className="macro-label">Fats</p>
                                    <p className="macro-value">
                                        {profileData.healthAssessment.metrics.macronutrients.fats}g
                                        {/* <span className="macro-percentage">
                                            ({profileData.healthAssessment.metrics.macronutrients.fats.percentage}%)
                                        </span> */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <p className="empty-message">You haven't completed your health assessment yet.</p>
                        <Link to="/health-assessment" className="green-button">
                            <Activity size={16} />
                            Complete Health Assessment
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;