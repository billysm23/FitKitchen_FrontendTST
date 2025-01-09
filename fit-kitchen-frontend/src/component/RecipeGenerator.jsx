import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateRecipes } from '../api/recipeApi';
import '../styles/RecipeGenerator.css';

const RecipeGenerator = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!ingredients.trim()) {
            toast.error('Please enter ingredients');
            return;
        }

        const ingredientList = ingredients
            .split(',')
            .map(i => i.trim())
            .filter(Boolean);

        if (ingredientList.length === 0) {
            toast.error('Please enter valid ingredients');
            return;
        }

        setLoading(true);
        try {
            const generatedRecipes = await generateRecipes(ingredientList);
            setRecipes(generatedRecipes);
            if (generatedRecipes.length === 0) {
                toast.info('No recipes found for these ingredients');
            }
        } catch (error) {
            console.error('Recipe generation failed:', error);
            toast.error(error.message || 'Failed to generate recipes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recipe-generator">
            <div className="recipe-input-section">
                <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients (separated by commas)"
                    className="recipe-input"
                    disabled={loading}
                />
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !ingredients.trim()}
                    className="recipe-generate-button"
                >
                    {loading ? 'Generating...' : 'Generate Recipes'}
                </button>
            </div>

            <div className="recipe-results">
                {loading ? (
                    <div className="recipe-loading">Generating recipes...</div>
                ) : recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <h3 className="recipe-title">{recipe.name}</h3>
                            <p className="recipe-description">{recipe.description}</p>
                            <div className="recipe-ingredients">
                                <h4>Ingredients:</h4>
                                <ul>
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                ) : null}
            </div>
        </div>
    );
};

export default RecipeGenerator;