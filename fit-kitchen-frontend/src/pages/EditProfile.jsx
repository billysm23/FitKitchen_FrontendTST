import { Activity, ClipboardList, Key, Ruler, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/EditProfile.css';

const ALLERGY_OPTIONS = [
    'Dairy & Dairy Products',
    'Eggs',
    'Nuts', 
    'Seafood',
    'Other'
];

const MEDICAL_CONDITION_OPTIONS = [
    'Diabetes',
    'Hypertension',
    'Acid Reflux (GERD)',
    'High Cholesterol',
    'Other'
];

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        age: '',
        gender: '',
        allergies: [],
        medicalConditions: [],
        medications: '',
        activityLevel: '',
        goalType: '',
        macroRatio: '',
        targetWeight: '',
        specificGoals: ''
    });
    
    const [otherAllergy, setOtherAllergy] = useState('');
    const [otherMedicalCondition, setOtherMedicalCondition] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await api.get('/api/profile');
                const { healthAssessment } = response.data;
                
                if (healthAssessment) {
                    setFormData({
                        height: healthAssessment?.height || '',
                        weight: healthAssessment?.weight || '',
                        age: healthAssessment?.age || '',
                        gender: healthAssessment?.gender || '',
                        allergies: healthAssessment?.health_history?.allergies || [],
                        medicalConditions: healthAssessment?.health_history?.medicalConditions || [],
                        medications: healthAssessment?.health_history?.medications || '',
                        activityLevel: healthAssessment?.activity_level || '',
                        goalType: healthAssessment?.health_goal || '',
                        macroRatio: healthAssessment?.macro_ratio || '',
                        targetWeight: healthAssessment?.target_weight || '',
                        specificGoals: healthAssessment?.specific_goals || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (category, value) => {
        setFormData(prev => {
            const currentArray = prev[category];
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value];
                
            return {
                ...prev,
                [category]: newArray
            };
        });
    };

    const handleAddOtherItem = (category, value, setValue) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [category]: [...prev[category].filter(item => item !== 'Other'), value.trim()]
            }));
            setValue('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const updatedData = {
                height: Number(formData.height),
                weight: Number(formData.weight),
                age: Number(formData.age),
                gender: formData.gender,
                health_history: {
                    allergies: formData.allergies,
                    medicalConditions: formData.medicalConditions,
                    medications: formData.medications
                },
                activity_level: formData.activityLevel,
                health_goal: formData.goalType,
                macro_ratio: formData.macroRatio,
                target_weight: Number(formData.targetWeight),
                specific_goals: formData.specificGoals
            };
            
            await api.put('/api/profile', updatedData);
            toast.success('Profile updated successfully');
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const renderCheckboxGroup = (options, category, label, otherState = '', setOtherState = null) => (
        <div className="profile-edit-form-group">
            <label className="profile-edit-group-label">{label}</label>
            <div className="profile-edit-checkbox-group">
                {options.map(option => (
                    <div key={`${category}-${option}`} className="profile-edit-checkbox-option">
                        <input
                            type="checkbox"
                            id={`${category}-${option}`}
                            checked={formData[category].includes(option)}
                            onChange={() => handleCheckboxChange(category, option)}
                            className="profile-edit-checkbox"
                        />
                        <label 
                            htmlFor={`${category}-${option}`}
                            className="profile-edit-checkbox-label"
                        >
                            {option}
                        </label>
                    </div>
                ))}
            </div>
                
            {formData[category].includes('Other') && setOtherState && (
                <div className="profile-edit-other-input">
                    <input
                        type="text"
                        value={otherState}
                        onChange={(e) => setOtherState(e.target.value)}
                        className="profile-edit-input"
                        placeholder={`Enter other ${label.toLowerCase()}`}
                    />
                    <button
                        type="button"
                        onClick={() => handleAddOtherItem(category, otherState, setOtherState)}
                        className="profile-edit-add-button"
                    >
                        Add
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="profile-edit-container">
            <div className="profile-edit-wrapper">
                {loading && (
                    <div className="profile-edit-loading">
                        <div className="profile-edit-spinner" />
                    </div>
                )}

                <h2 className="profile-edit-title">Edit Profile</h2>

                <form onSubmit={handleSubmit}>
                    {/* Security Section */}
                    <div className="profile-edit-section">
                        <h3 className="profile-edit-section-title">
                            <ShieldCheck size={20} />
                            Security
                        </h3>
                        <div className="profile-edit-security">
                            <Link to="/profile/change-password" className="profile-edit-password-button">
                                <Key size={16} />
                                Change Password
                            </Link>
                        </div>
                    </div>

                    {/* Measurement Data */}
                    <div className="profile-edit-section">
                        <h3 className="profile-edit-section-title">
                            <Ruler size={20} />
                            Measurement Data
                        </h3>
                        
                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="profile-edit-input"
                                min="100"
                                max="250"
                            />
                        </div>
                        
                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="profile-edit-input"
                                min="30"
                                max="200"
                            />
                        </div>
                        
                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="profile-edit-input"
                                min="15"
                                max="100"
                            />
                        </div>
                        
                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="profile-edit-select"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Health History Section */}
                    <div className="profile-edit-section">
                        <h3 className="profile-edit-section-title">
                            <ClipboardList size={20} />
                            Health History
                        </h3>
                        
                        {renderCheckboxGroup(
                            ALLERGY_OPTIONS,
                            'allergies',
                            'Food Allergies/Intolerances',
                            otherAllergy,
                            setOtherAllergy
                        )}

                        {renderCheckboxGroup(
                            MEDICAL_CONDITION_OPTIONS,
                            'medicalConditions',
                            'Medical Conditions',
                            otherMedicalCondition,
                            setOtherMedicalCondition
                        )}

                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Current Medications</label>
                            <textarea
                                name="medications"
                                value={formData.medications}
                                onChange={handleChange}
                                className="profile-edit-textarea"
                                placeholder="List any medications you are currently taking"
                            />
                        </div>
                    </div>

                    {/* Activity & Goals Section */}
                    <div className="profile-edit-section">
                        <h3 className="profile-edit-section-title">
                            <Activity size={20} />
                            Activity & Goals
                        </h3>
                        
                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Activity Level</label>
                            <select
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleChange}
                                className="profile-edit-select"
                            >
                                <option value="">Select activity level</option>
                                <option value="sedentary">Sedentary</option>
                                <option value="light">Light</option>
                                <option value="moderate">Moderate</option>
                                <option value="active">Active</option>
                                <option value="very_active">Very Active</option>
                            </select>
                        </div>
                        
                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Health Goal</label>
                            <select
                                name="goalType"
                                value={formData.goalType}
                                onChange={handleChange}
                                className="profile-edit-select"
                            >
                                <option value="">Select goal</option>
                                <option value="fat_loss">Fat Loss</option>
                                <option value="muscle_gain">Muscle Building/Weight Gain</option>
                                <option value="health">General Health</option>
                                <option value="disease">Disease Management</option>
                                <option value="energy">Increase Energy</option>
                            </select>
                        </div>

                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Target Weight (kg)</label>
                            <input
                                type="number"
                                name="targetWeight"
                                value={formData.targetWeight}
                                onChange={handleChange}
                                className="profile-edit-input"
                                min="30"
                                max="200"
                            />
                        </div>

                        <div className="profile-edit-form-group">
                            <label className="profile-edit-label">Specific Goals</label>
                            <textarea
                                name="specificGoals"
                                value={formData.specificGoals}
                                onChange={handleChange}
                                className="profile-edit-textarea"
                                placeholder="Write any specific goals you want to achieve"
                            />
                        </div>
                    </div>

                    <div className="profile-edit-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/profile')} 
                            className="profile-edit-button profile-edit-cancel"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="profile-edit-button profile-edit-submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default EditProfile;