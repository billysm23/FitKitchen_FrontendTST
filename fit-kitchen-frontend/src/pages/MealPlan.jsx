import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/MealPlan.css';

const MealPlan = () => {
    const [healthProfile, setHealthProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHealthProfile();
    }, []);

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
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            id: 'single',
            name: 'Single Meal',
            subtitle: 'Perfect for lunch at work',
            basePrice: 50000,
            features: [
                '1 meal per day',
                'Personalized portion size',
                'Balanced nutrition',
                'Fresh ingredients'
            ],
            calorieRatio: 0.3,
            maxMenus: 1
        },
        {
            id: 'half_day',
            name: 'Half Day',
            subtitle: 'Ideal for busy professionals',
            basePrice: 45000,
            features: [
                '2-4 meals per day',
                'Personalized portion sizes',
                'Balanced nutrition',
                'Fresh ingredients',
                'Nutrition consultation'
            ],
            calorieRatio: 0.5,
            maxMenus: 4,
            recommended: true
        },
        {
            id: 'full_day',
            name: 'Full Day',
            subtitle: 'Complete daily nutrition',
            basePrice: 40000,
            features: [
                '4-8 meals per day',
                'Personalized portion sizes',
                'Balanced nutrition',
                'Fresh ingredients',
                'Free delivery',
                'Nutrition consultation'
            ],
            calorieRatio: 0.9,
            maxMenus: 8
        }
    ];

    const handleSelectPlan = async (planId) => {
        try {
            setLoading(true);
            const response = await api.post('/api/meal-plan/initialize', { 
                plan_type: planId 
            });
            
            if (response.success) {
                navigate(`/menu-selection/${planId}`, {
                    state: { 
                        recommendations: response.data.recommendations,
                        planDetails: response.data.planDetails,
                        targetNutrition: response.data.targetNutrition
                    }
                });
            } else {
                throw new Error('Failed to initialize plan');
            }
        } catch (error) {
            console.error('Error initializing plan:', error);
            setError('Failed to initialize meal plan. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="meal-plans-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="meal-plans-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="meal-plans-container">
            <div className="meal-plans-header">
                <h1 className="meal-plans-title">Choose Your Meal Plan</h1>
                <p className="meal-plans-description">
                    Personalized meal plans designed to meet your daily caloric needs
                    of {healthProfile?.metrics?.final_cal} calories
                </p>
            </div>

            <div className="plan-cards">
                {plans.map((plan) => {
                    const planCalories = Math.round(healthProfile?.metrics?.final_cal * plan.calorieRatio) || 0;
                    const planProtein = Math.round(healthProfile?.metrics?.macronutrients?.protein * plan.calorieRatio) || 0;

                    return (
                        <div 
                            key={plan.id} 
                            className={`plan-card ${plan.recommended ? 'recommended' : ''}`}
                        >
                            {plan.recommended && (
                                <span className="recommended-badge">Recommended</span>
                            )}

                            <h2 className="plan-name">{plan.name}</h2>
                            <p className="plan-subtitle">{plan.subtitle}</p>

                            <div className="plan-price">
                                Rp {plan.basePrice.toLocaleString('id-ID')}
                                <span>/meal</span>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="plan-feature">
                                        <Check className="feature-icon" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="nutrition-info">
                                <h3 className="nutrition-title">Daily Nutrition</h3>
                                <div className="nutrition-details">
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Calories:</span>
                                        <span className="nutrition-value">
                                            ~{planCalories} kcal
                                        </span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Protein:</span>
                                        <span className="nutrition-value">
                                            {planProtein}g
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className={`select-plan-button ${
                                    plan.recommended ? '' : 'outline'
                                }`}
                            >
                                Select Plan
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="browse-menu">
                <a href="/menu" class="browse-menu-text">
                    I want to browse menu before select plan
                </a>
            </div>
        </div>
    );
};

export default MealPlan;