import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import '../styles/MenuSelection.css';

const MEALS_PER_PLAN = {
    single: 1,
    half_day: 2,
    full_day: 4
};

const MenuSelection = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [availableMenus, setAvailableMenus] = useState([]);
    const [healthProfile, setHealthProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHealthProfile();
    }, []);

    useEffect(() => {
        if (healthProfile) {
            fetchAvailableMenus();
        }
    }, [healthProfile]);

    const fetchHealthProfile = async () => {
        try {
            const response = await api.get('/api/profile');
            if (response.success && response.data.healthAssessment) {
                setHealthProfile(response.data.healthAssessment);
            } else {
                navigate('/health-assessment');
            }
        } catch (error) {
            console.error('Error fetching health profile:', error);
            setError('Failed to load health profile');
        }
    };

    const fetchAvailableMenus = async () => {
        try {
            // Calculate calories per meal based on plan type
            let targetCalories;
            const dailyCalories = healthProfile.metrics.final_cal;

            switch (planId) {
                case 'single':
                    targetCalories = dailyCalories * 0.3;
                    break;
                case 'half_day':
                    targetCalories = (dailyCalories * 0.5) / 2;
                    break;
                case 'full_day':
                    targetCalories = dailyCalories / 4;
                    break;
                default:
                    throw new Error('Invalid plan type');
            }

            const response = await api.get('/api/menus/recommended', {
                params: {
                    meal_plan_type: planId,
                    target_calories: targetCalories,
                    allergies: healthProfile.health_history.allergies.join(',')
                }
            });

            if (response.success) {
                setAvailableMenus(response.data);
            } else {
                throw new Error('Failed to fetch menus');
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
            setError('Failed to load available menus');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuSelect = (menu) => {
        const maxSelections = MEALS_PER_PLAN[planId];
        
        setSelectedMenus(prev => {
            const isSelected = prev.some(m => m.id === menu.id);
            
            if (isSelected) {
                return prev.filter(m => m.id !== menu.id);
            } else if (prev.length < maxSelections) {
                return [...prev, menu];
            }
            
            return prev;
        });
    };

    const handleNext = () => {
        if (step === 1) {
            if (selectedMenus.length === MEALS_PER_PLAN[planId]) {
                setStep(2);
            }
        } else {
            navigate('/checkout', { 
                state: { 
                    selectedMenus,
                    planType: planId 
                } 
            });
        }
    };

    const handleBack = () => {
        if (step === 1) {
            navigate('/meal-plans');
        } else {
            setStep(1);
        }
    };

    if (loading) {
        return (
            <div className="menu-selection-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="menu-selection-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="menu-selection-container">
            <div className="menu-selection-header">
                <h1 className="menu-selection-title">
                    {step === 1 ? 'Select Your Meals' : 'Review Your Selection'}
                </h1>
                <p className="menu-selection-subtitle">
                    {step === 1 
                        ? `Choose ${MEALS_PER_PLAN[planId]} meals for your plan` 
                        : 'Review your meals and proceed to checkout'}
                </p>
            </div>

            <div className="selection-steps">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Select Meals</div>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Review</div>
                </div>
                <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-label">Checkout</div>
                </div>
            </div>

            <div className="menu-grid">
            {(step === 1 ? availableMenus : selectedMenus).map(menu => (
                <div 
                    key={menu.id}
                    className={`menu-card ${
                        selectedMenus.some(m => m.id === menu.id) ? 'selected' : ''
                    }`}
                    onClick={() => step === 1 && handleMenuSelect(menu)}
                >
                    {menu.image_url ? (
                        <img 
                            src={menu.image_url} 
                            alt={menu.name}
                            className="menu-image"
                        />
                    ) : (
                        <div className="menu-image" />
                    )}

                    <div className="menu-content">
                        <h3 className="menu-name">{menu.name}</h3>
                        <p className="menu-description">{menu.description}</p>

                        <div className="menu-macros">
                            <div className="macro-item">
                                <span className="macro-value">
                                    {menu.calories_per_serving}
                                </span>
                                <span className="macro-label">calories</span>
                            </div>
                            <div className="macro-item">
                                <span className="macro-value">
                                    {menu.protein_per_serving}g
                                </span>
                                <span className="macro-label">protein</span>
                            </div>
                            <div className="macro-item">
                                <span className="macro-value">
                                    {menu.carbs_per_serving}g
                                </span>
                                <span className="macro-label">carbs</span>
                            </div>
                            <div className="macro-item">
                                <span className="macro-value">
                                    {menu.fats_per_serving}g
                                </span>
                                <span className="macro-label">fats</span>
                            </div>
                        </div>

                        {selectedMenus.some(m => m.id === menu.id) && (
                            <div className="selected-indicator">
                                <Check className="check-icon" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
            </div>

            <div className="menu-selection-footer">
                {/* <RecipeGenerator /> */}
                <button 
                    onClick={handleBack}
                    className="navigation-button back"
                >
                    <ChevronLeft className="button-icon" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={selectedMenus.length !== MEALS_PER_PLAN[planId]}
                    className="navigation-button next"
                >
                    {step === 1 ? 'Review Selection' : 'Proceed to Checkout'}
                    <ChevronRight className="button-icon" />
                </button>
            </div>
        </div>
    );
}

export default MenuSelection;