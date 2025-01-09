import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import MenuProgressIndicator from '../component/MenuProgressIndicator';
import '../styles/MenuSelection.css';

const MenuSelection = () => {
    const { plan_type } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [planDetails, setPlanDetails] = useState(null);
    const [targetNutrition, setTargetNutrition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [selectionScore, setSelectionScore] = useState(0);

    useEffect(() => {
        if (!location.state?.recommendations || !location.state?.planDetails || !plan_type) {
            toast.error('Please select a meal plan first');
            navigate('/meal-plan');
            return;
        }

        const { recommendations, planDetails, targetNutrition } = location.state;
        setRecommendations(recommendations);
        setPlanDetails(planDetails);
        setTargetNutrition(targetNutrition);
        setLoading(false);
    }, [location.state, plan_type, navigate]);

    const handleMenuSelect = (menu) => {
        const maxSelections = planDetails?.maxMenus || 1;
        
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

    const handleNext = async () => {
        if (step === 1) {
            if (selectedMenus.length < (planDetails?.minMenus || 1)) {
                toast.error(`Please select at least ${planDetails.minMenus} menu${planDetails.minMenus > 1 ? 's' : ''}`);
                return;
            }

            try {
                const response = await api.post('/api/menu/validate-selection', {
                    menuIds: selectedMenus.map(menu => menu.id),
                    plan_type
                });

                if (response.success && response.data.isValid) {
                    setStep(2);
                } else {
                    toast.error(response.data?.validationDetails?.message || 'Invalid menu selection');
                }
            } catch (error) {
                console.error('Validation error:', error);
                toast.error('Failed to validate menu selection');
            }
        } else {
            // Create meal plan
            try {
                const response = await api.post('/api/meal-plan/create', {
                    plan_type,
                    menuIds: selectedMenus.map(menu => menu.id)
                });

                if (response.success) {
                    toast.success('Meal plan created successfully');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error creating meal plan:', error);
                toast.error('Failed to create meal plan');
            }
        }
    };

    const handleBack = () => {
        if (step === 1) {
            navigate('/meal-plan');
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

    const totalNutrition = selectedMenus.reduce((acc, menu) => ({
        calories: acc.calories + menu.calories_per_serving,
        protein: acc.protein + menu.protein_per_serving,
        carbs: acc.carbs + menu.carbs_per_serving,
        fats: acc.fats + menu.fats_per_serving
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const renderNutritionInfo = (menu) => {
        const targetCalories = planDetails?.maxTotalCalories / planDetails?.maxMenus;
        const calorieDeviation = Math.abs(menu.calories_per_serving - targetCalories) / targetCalories;
        const isCaloriesGood = calorieDeviation <= 0.2; // 20% tolerance

        return (
            <div className="menu-macros">
                <div className={`macro-item ${!isCaloriesGood ? 'warning' : ''}`}>
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
        );
    };

    return (
        <div className="menu-selection-container">
            <div className="menu-selection-header">
                <h1 className="menu-selection-title">
                    {step === 1 ? 'Select Your Meals' : 'Review Your Selection'}
                </h1>
                <p className="menu-selection-subtitle">
                    {step === 1 
                        ? `Choose ${planDetails?.minMenus} to ${planDetails?.maxMenus} meals for your plan` 
                        : 'Review your meals and proceed to checkout'}
                </p>
            </div>
                
            <MenuProgressIndicator
                selectedMenus={selectedMenus}
                planDetails={planDetails}
                targetNutrition={targetNutrition}
                onScoreChange={setSelectionScore}
            />

            <div className="nutrition-cards">
                <div className="nutrition-card target-nutrition">
                    <h3 className="nutrition-card-title">Target Nutrition</h3>
                    <div className="nutrition-info">
                        <div className="nutrition-item">
                            <span className="nutrition-label">Calories:</span>
                            <span className="nutrition-value">{targetNutrition?.planCalories || '-'}</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="nutrition-label">Protein:</span>
                            <span className="nutrition-value">{targetNutrition?.macros.protein || '-'}g</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="nutrition-label">Carbs:</span>
                            <span className="nutrition-value">{targetNutrition?.macros.carbs || '-'}g</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="nutrition-label">Fats:</span>
                            <span className="nutrition-value">{targetNutrition?.macros.fats || '-'}g</span>
                        </div>
                    </div>
                </div>

                <div className="nutrition-card total-nutrition">
                    <h3 className="nutrition-card-title">Total Nutrition</h3>
                    <div className="nutrition-info">
                        <div className="nutrition-item">
                            <span className="nutrition-label">Calories:</span>
                            <span className="nutrition-value">{totalNutrition?.calories || '-'}</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="nutrition-label">Protein:</span>
                            <span className="nutrition-value">{totalNutrition?.protein || '-'}g</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="nutrition-label">Carbs:</span>
                            <span className="nutrition-value">{totalNutrition?.carbs || '-'}g</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="nutrition-label">Fats:</span>
                            <span className="nutrition-value">{totalNutrition?.fats || '-'}g</span>
                        </div>
                    </div>
                </div>
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
                {(step === 1 ? recommendations : selectedMenus).map(menu => (
                    <div 
                        key={menu.id}
                        className={`menu-card ${
                            selectedMenus.some(m => m.id === menu.id) ? 'selected' : ''
                        }`}
                        onClick={() => step === 1 && handleMenuSelect(menu)}
                    >
                        <div className="menu-image-container">
                            {menu.image_url ? (
                                <img 
                                    src={menu.image_url} 
                                    alt={menu.name}
                                    className="menu-image"
                                />
                            ) : (
                                <div className="menu-image placeholder" />
                            )}
                        </div>

                        <div className="menu-content">
                            <h3 className="menu-name">{menu.name}</h3>
                            <p className="menu-description">{menu.description}</p>

                            {renderNutritionInfo(menu)}

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
                <button 
                    onClick={handleBack}
                    className="navigation-button back"
                    disabled={validating}
                >
                    <ChevronLeft className="button-icon back" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={validating || selectedMenus.length < (planDetails?.minMenus || 1)}
                    className="navigation-button next"
                >
                    {validating ? 'Processing...' : step === 1 ? 'Review Selection' : 'Create Plan'}
                    <ChevronRight className="button-icon next" />
                </button>
            </div>
        </div>
    );
};

export default MenuSelection;