import React, { useEffect, useState } from 'react';
import '../styles/MenuProgressIndicator.css';

const MenuProgressIndicator = ({ 
    selectedMenus,
    planDetails,
    targetNutrition,
    onScoreChange
}) => {
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!selectedMenus.length || !planDetails || !targetNutrition) {
            setScore(0);
            setMessage('Choose your menu');
            onScoreChange(0);
            return;
        }

        const totalNutrition = selectedMenus.reduce((acc, menu) => ({
            calories: acc.calories + menu.calories_per_serving,
            protein: acc.protein + menu.protein_per_serving,
            carbs: acc.carbs + menu.carbs_per_serving,
            fats: acc.fats + menu.fats_per_serving
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        const nutritionScore = calculateMenuScore(totalNutrition, targetNutrition, planDetails);
        setScore(nutritionScore);
        onScoreChange(nutritionScore);

        // Set message
        if (nutritionScore >= 90) {
            setMessage('Excellent combination! Ready to proceed.');
        } else if (nutritionScore >= 70) {
            setMessage('Good balance! You need to improve a little bit further.');
        } else if (nutritionScore >= 50) {
            setMessage('Fair selection. Consider adjusting for better balance.');
        } else if (selectedMenus.length < planDetails.minMenus) {
            setMessage(`Select ${planDetails.minMenus - selectedMenus.length} more meal${planDetails.minMenus - selectedMenus.length !== 1 ? 's' : ''}`);
        } else {
            setMessage('Try selecting different meals for better nutrition balance');
        }

    }, [selectedMenus, planDetails, targetNutrition, onScoreChange]);

    // Same calculation function from backend
    const calculateMenuScore = (totalNutrition, targetNutrition, planDetails) => {
        const maxScore = 100;
        
        const proteinDiff = Math.abs(totalNutrition.protein - targetNutrition.macros.protein);
        const carbsDiff = Math.abs(totalNutrition.carbs - targetNutrition.macros.carbs);
        const fatsDiff = Math.abs(totalNutrition.fats - targetNutrition.macros.fats);
        
        const proteinScore = Math.max(0, maxScore - (proteinDiff / targetNutrition.macros.protein) * 100);
        const carbsScore = Math.max(0, maxScore - (carbsDiff / targetNutrition.macros.carbs) * 100);
        const fatsScore = Math.max(0, maxScore - (fatsDiff / targetNutrition.macros.fats) * 100);
        
        const weights = {
            protein: 1.2,
            carbs: 0.7,
            fats: 1.0
        };
        
        const weightedScore = (proteinScore * weights.protein + carbsScore * weights.carbs + fatsScore * weights.fats) / (weights.protein + weights.carbs + weights.fats);
        
        return Math.round(weightedScore);
    };

    const getColor = () => {
        if (score >= 90) return '#22c55e';
        if (score >= 70) return '#84cc16';
        if (score >= 50) return '#eab308';
        return '#ef4444';
    };

    return (
        <div className="menu-progress-container sticky">
            <div className="menu-progress-container">
                <div className="menu-progress-label">
                    Menu Selection Progress
                </div>
                <div className="menu-progress-bar">
                    <div 
                        className="menu-progress-fill"
                        style={{ width: `${score}%`, backgroundColor: getColor() }}
                    />
                </div>
                <div className="menu-progress-info">
                    <span className="menu-progress-score" style={{ color: getColor() }}>
                        {score}%
                    </span>
                    <span className="menu-progress-message">
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MenuProgressIndicator;
// Finally :)