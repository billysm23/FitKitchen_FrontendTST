import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/HealthAssessment.module.css';
import { sessionManager } from '../utils/session';

const HealthAssessment = () => {
    const navigate = useNavigate();
    const initialFormState = {
        // Measurement Data
        height: '',
        weight: '',
        age: '',
        gender: '',
        
        // Health History
        health_history: {
            allergies: [],
            medicalConditions: [],
            medications: ''
        },
        macro_ratio: 'moderate_carb',
        
        // Physical Activity & Goals
        activity_level: '',
        health_goal: '',
        specific_goals: '',
        target_weight: ''
    };
    
    const [otherAllergy, setOtherAllergy] = useState('');
    const [otherMedicalCondition, setOtherMedicalCondition] = useState('');

    const handleAddOtherAllergy = () => {
        if (otherAllergy.trim()) {
            setFormData(prev => ({
                ...prev,
                health_history: {
                    ...prev.health_history,
                    allergies: [...prev.health_history.allergies.filter(a => a !== 'Other'), otherAllergy.trim()]
                }
            }));
            setOtherAllergy('');
        }
    };
    
    const handleAddOtherMedicalCondition = () => {
        if (otherMedicalCondition.trim()) {
            setFormData(prev => ({
                ...prev,
                health_history: {
                    ...prev.health_history,
                    medicalConditions: [...prev.health_history.medicalConditions.filter(m => m !== 'Other'), otherMedicalCondition.trim()]
                }
            }));
            setOtherMedicalCondition('');
        }
    };

    const [formData, setFormData] = useState(initialFormState);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleHealth_historyCheckbox = (category, value) => {
        setFormData(prev => {
            const currentArray = prev.health_history[category] || [];
            const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
            
            return {
                ...prev,
                health_history: {
                    ...prev.health_history,
                    [category]: newArray
                }
            };
        });
    };
    
    const handleHealth_historyChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            health_history: {
                ...prev.health_history,
                [name]: value
            }
        }));
    };
    
    const renderHealth_historyCheckboxGroup = (category, options, label) => {
        const selectedValues = formData.health_history[category] || [];
        
        return (
            <div className={styles.form_group}>
                <label className={styles.form_label}>{label}</label>
                <div className={styles.checkbox_group}>
                    {options.map(option => (
                        <div key={option} className={styles.checkbox_option}>
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                onChange={() => handleHealth_historyCheckbox(category, option)}
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
    
    const [currentStep, setCurrentStep] = useState(1);
    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.height || !formData.weight || !formData.age || !formData.gender) {
                    toast.error('Please complete all measurement data');
                    return false;
                }
                return true;
                case 2:
                    if (!formData.health_history.medications) {
                        toast.error('Please complete health history information');
                        return false;
                    }
                    return true;
                    case 3:
                        if (!formData.activity_level || !formData.health_goal || formData.target_weight < 30) {
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
                            
                            {renderHealth_historyCheckboxGroup(
                                'allergies',
                                ['Dairy & Dairy Products','Eggs','Nuts','Seafood','Other'],
                                'Food Allergies/Intolerances'
                            )}

                            {formData.health_history.allergies.includes('Other') && (
                                <div className={styles.form_group}>
                                    <div className={styles.input_group}>
                                        <input
                                            type="text"
                                            value={otherAllergy}
                                            onChange={(e) => setOtherAllergy(e.target.value)}
                                            className={styles.form_input}
                                            placeholder="Enter other allergy/intolerance"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddOtherAllergy}
                                            className={styles.add_button}
                                        >
                                            Add
                                        </button>
                                        <small className={styles.form_helper}>
                                            When you press the 'Add' button, your text will be added directly to database
                                        </small>
                                    </div>
                                </div>
                            )}

                            {renderHealth_historyCheckboxGroup(
                                'medicalConditions',
                                ['Diabetes','Hypertension','Acid Reflux (GERD)','High Cholesterol','Other'],
                                'Medical Conditions'
                            )}

                            {formData.health_history.medicalConditions.includes('Other') && (
                                <div className={styles.form_group}>
                                    <div className={styles.input_group}>
                                        <input
                                            type="text"
                                            value={otherMedicalCondition}
                                            onChange={(e) => setOtherMedicalCondition(e.target.value)}
                                            className={styles.form_input}
                                            placeholder="Enter other medical condition"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddOtherMedicalCondition}
                                            className={styles.add_button}
                                        >
                                            Add
                                        </button>
                                        <small className={styles.form_helper}>
                                            When you press the 'Add' button, your text will be added directly to database
                                        </small>
                                    </div>
                                </div>
                            )}

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Current Medications</label>
                                <textarea
                                    name="medications"
                                    value={formData.health_history.medications}
                                    onChange={handleHealth_historyChange}
                                    className={styles.form_textarea}
                                    placeholder="List any medications you are currently taking (type 'None' if not take any)"
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Preferred Macro Ratio</label>
                                <select
                                    name="macro_ratio"
                                    value={formData.macro_ratio}
                                    onChange={handleInputChange}
                                    className={styles.form_select}
                                >
                                    <option value="moderate_carb">Balanced</option>
                                    <option value="lower_carb">Low Carb</option>
                                    <option value="higher_carb">High Carb</option>
                                </select>
                                <small className={styles.form_helper}>
                                    Choose your preferred macronutrient distribution.<br></br>
                                    This will affect how your daily calories are divided between protein, fats, and carbohydrates.
                                    <ul className={styles.macro_info}>
                                        <li>Balanced: Good for general fitness and maintenance</li>
                                        <li>Low Carb: May help with fat loss and blood sugar control</li>
                                        <li>High Carb: Better for high-intensity activities and muscle gain</li>
                                    </ul>
                                </small>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.form_section}>
                            <h2 className={styles.section_title}>Physical Activity & Goals</h2>
                            
                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Activity Level</label>
                                <select
                                    name="activity_level"
                                    value={formData.activity_level}
                                    onChange={handleInputChange}
                                    className={styles.form_select}
                                >
                                    <option value="">Select activity level</option>
                                    <option value="sedentary">Sedentary (Little to no exercise, desk job)</option>
                                    <option value="light">Light (1-2 workouts/week)</option>
                                    <option value="moderate">Moderate (3-4 workouts/week)</option>
                                    <option value="active">Active (5+ workouts/week)</option>
                                    <option value="very_active">Very Active (Athlete/Physical Worker)</option>
                                </select>
                                <small className={styles.form_helper}>
                                    Select the level that best describes your daily physical activity including regular exercise
                                </small>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Health Goal</label>
                                <select
                                    name="health_goal"
                                    value={formData.health_goal}
                                    onChange={handleInputChange}
                                    className={styles.form_select}
                                >
                                    <option value="">Select goal</option>
                                    <option value="fat_loss">Fat Loss</option>
                                    <option value="muscle_gain">Muscle Building/Weight Gain</option>
                                    <option value="health">General Health</option>
                                    <option value="disesase">Disease Management</option>
                                    <option value="energy">Increase Energy</option>
                                </select>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Target Weight (optional)</label>
                                <div className={styles.input_group}>
                                    <input
                                        type="number"
                                        name="target_weight"
                                        value={formData.target_weight}
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
                                    name="specific_goals"
                                    value={formData.specific_goals}
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
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HealthAssessment;