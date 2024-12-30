import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/HealthAssessment.module.css';
import { sessionManager } from '../utils/session';

const HealthAssessment = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const initialFormState = {
        // Measurement Data
        height: '',
        weight: '',
        age: '',
        gender: '',
        
        // Health History
        healthHistory: {
            allergies: [],
            intolerances: [],
            familyHistory: [],
            medications: ''
        },
        
        // Physical Activity & Goals
        activityLevel: '',
        exerciseFrequency: '',
        healthGoals: [],
        specificGoals: '',
        targetWeight: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleHealthHistoryCheckbox = (category, value) => {
        setFormData(prev => {
            const currentArray = prev.healthHistory[category] || [];
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value];
            
            return {
                ...prev,
                healthHistory: {
                    ...prev.healthHistory,
                    [category]: newArray
                }
            };
        });
    };

    const handleHealthHistoryChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            healthHistory: {
                ...prev.healthHistory,
                [name]: value
            }
        }));
    };

    const renderHealthHistoryCheckboxGroup = (category, options, label) => {
        const selectedValues = formData.healthHistory[category] || [];
        
        return (
            <div className={styles.form_group}>
                <label className={styles.form_label}>{label}</label>
                <div className={styles.checkbox_group}>
                    {options.map(option => (
                        <div key={option} className={styles.checkbox_option}>
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                onChange={() => handleHealthHistoryCheckbox(category, option)}
                                id={`${category}-${option}`}
                            />
                            <label 
                                htmlFor={`${category}-${option}`}
                                className={styles.checkbox_label}
                            >
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.height || !formData.weight || !formData.age || !formData.gender) {
                    toast.error('Please complete all measurement data');
                    return false;
                }
                return true;
            case 2:
                if (!formData.healthHistory.medications) {
                    toast.error('Please complete health history information');
                    return false;
                }
                return true;
            case 3:
                if (!formData.activityLevel || !formData.exerciseFrequency || formData.healthGoals.length === 0) {
                    toast.error('Please complete activity and goals information');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        try {
            const session = sessionManager.getSession();
            const token = session?.token;

            if (!token) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
                return;
            }
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health-assessment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Assessment saved successfully!');
                navigate('/dashboard');
            } else {
                throw new Error(data.error?.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Health assessment error:', error);
            toast.error(error.message);
        }
    };

    const handleCheckboxChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    return (
        <div className={styles.assessment_container}>
            <div className={styles.assessment_header}>
                <h1 className={styles.assessment_title}>Health Assessment</h1>
                <p className={styles.assessment_description}>
                    Complete your health information to receive personalized menu recommendations
                </p>
            </div>

            <div className={styles.progress_bar}>
                <div 
                    className={styles.progress_fill} 
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                />
            </div>

            <div className={styles.form_container}>
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className={styles.form_section}>
                            <h2 className={styles.section_title}>Measurement Data</h2>
                            
                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Height</label>
                                <div className={styles.input_group}>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className={styles.form_input}
                                        placeholder="170"
                                        min="100"
                                        max="250"
                                    />
                                    <span className={styles.input_addon}>cm</span>
                                </div>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Weight</label>
                                <div className={styles.input_group}>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className={styles.form_input}
                                        placeholder="65"
                                        min="30"
                                        max="200"
                                    />
                                    <span className={styles.input_addon}>kg</span>
                                </div>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className={styles.form_input}
                                    placeholder="25"
                                    min="15"
                                    max="100"
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Gender</label>
                                <div className={styles.radio_group}>
                                    <div className={styles.radio_option}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={handleInputChange}
                                        />
                                        <label className={styles.radio_label}>Male</label>
                                    </div>
                                    <div className={styles.radio_option}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={handleInputChange}
                                        />
                                        <label className={styles.radio_label}>Female</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={styles.form_section}>
                            <h2 className={styles.section_title}>Health History</h2>
                            
                            {renderHealthHistoryCheckboxGroup(
                                'allergies',
                                ['Milk', 'Eggs', 'Nuts', 'Seafood', 'Gluten', 'Soy'],
                                'Food Allergies'
                            )}
                            
                            {renderHealthHistoryCheckboxGroup(
                                'intolerances',
                                ['Lactose', 'Fructose', 'Gluten', 'MSG'],
                                'Food Intolerances'
                            )}
                            
                            {renderHealthHistoryCheckboxGroup(
                                'familyHistory',
                                ['Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol'],
                                'Family Medical History'
                            )}

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Current Medications</label>
                                <textarea
                                    name="medications"
                                    value={formData.healthHistory.medications}
                                    onChange={handleHealthHistoryChange}
                                    className={styles.form_textarea}
                                    placeholder="List any medications you are currently taking (if any)"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.form_section}>
                            <h2 className={styles.section_title}>Physical Activity & Goals</h2>
                            
                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Activity Level</label>
                                <select
                                    name="activityLevel"
                                    value={formData.activityLevel}
                                    onChange={handleInputChange}
                                    className={styles.form_select}
                                >
                                    <option value="">Select activity level</option>
                                    <option value="sedentary">Sedentary (Rarely Active)</option>
                                    <option value="light">Light (1-2 workouts/week)</option>
                                    <option value="moderate">Moderate (3-4 workouts/week)</option>
                                    <option value="active">Active (5+ workouts/week)</option>
                                    <option value="very_active">Very Active (Athlete/Physical Worker)</option>
                                </select>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Exercise Frequency</label>
                                <select
                                    name="exerciseFrequency"
                                    value={formData.exerciseFrequency}
                                    onChange={handleInputChange}
                                    className={styles.form_select}
                                >
                                    <option value="">Select exercise frequency</option>
                                    <option value="never">Never</option>
                                    <option value="rarely">Rarely (1-2 times/month)</option>
                                    <option value="sometimes">Sometimes (1-2 times/week)</option>
                                    <option value="often">Often (3-4 times/week)</option>
                                    <option value="regular">Regular (5+ times/week)</option>
                                </select>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Health Goals</label>
                                <div className={styles.checkbox_group}>
                                    {[
                                        'Weight Loss',
                                        'Weight Gain',
                                        'Muscle Building',
                                        'General Health',
                                        'Increase Energy',
                                        'Disease Management'
                                    ].map(goal => (
                                        <div key={goal} className={styles.checkbox_option}>
                                            <input
                                                type="checkbox"
                                                checked={formData.healthGoals.includes(goal)}
                                                onChange={() => handleCheckboxChange('healthGoals', goal)}
                                                id={`goal-${goal}`}
                                            />
                                            <label 
                                                htmlFor={`goal-${goal}`}
                                                className={styles.checkbox_label}
                                            >
                                                {goal}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Target Weight (optional)</label>
                                <div className={styles.input_group}>
                                    <input
                                        type="number"
                                        name="targetWeight"
                                        value={formData.targetWeight}
                                        onChange={handleInputChange}
                                        className={styles.form_input}
                                        placeholder="60"
                                        min="30"
                                        max="200"
                                    />
                                    <span className={styles.input_addon}>kg</span>
                                </div>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Specific Goals</label>
                                <textarea
                                    name="specificGoals"
                                    value={formData.specificGoals}
                                    onChange={handleInputChange}
                                    className={styles.form_textarea}
                                    placeholder="Write any specific goals you want to achieve"
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.navigation_buttons}>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className={`${styles.button} ${styles.button_secondary}`}
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className={`${styles.button} ${styles.button_primary}`}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className={`${styles.button} ${styles.button_primary}`}
                            >
                                Sumbit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HealthAssessment;