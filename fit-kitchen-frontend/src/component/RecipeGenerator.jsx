import { Check, ChefHat, ChevronsRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateRecipes } from '../api/recipeApi';
import '../styles/RecipeGenerator.css';

const RecipeGenerator = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

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
        setSubmitted(false);
        
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

    const handleSubmitRecipe = async (recipe) => {
        setLoading(true);
        
        // Simulasi pengiriman ke server
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSelectedRecipe(recipe);
        setSubmitted(true);
        setLoading(false);
        toast.success('Recipe submitted successfully!');
    };

    return (
        <div className="recipe-generator">
            <div className="recipe-header">
                <h1 className="recipe-title">Recipe Recommendation</h1>
                <p className="recipe-subtitle">
                    Help us improve our menu by suggesting recipes using your favorite ingredients
                </p>
            </div>

            <div className="recipe-input-section">
                <div className="recipe-input-wrapper">
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
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Generating...
                            </>
                        ) : (
                            <>
                                <ChefHat size={20} />
                                Generate Recipes
                            </>
                        )}
                    </button>
                </div>
                <p className="recipe-helper">
                    Tip: Enter ingredients like "chicken, rice, tomatoes" to generate recipe suggestions
                </p>
            </div>

            <div className="recipe-results">
                {loading ? (
                    <div className="recipe-loading">
                        <div className="recipe-loading-spinner" />
                        Generating your recipes...
                    </div>
                ) : submitted && selectedRecipe ? (
                    <div className="recipe-success">
                        <Check className="recipe-success-icon" />
                        <h3 className="recipe-success-title">Recipe Submitted Successfully!</h3>
                        <p className="recipe-success-message">
                            Thank you for recommending "{selectedRecipe.name}". Our chefs will review your suggestion
                            and consider adding it to our menu.
                        </p>
                    </div>
                ) : (
                    recipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <h3 className="recipe-card-title">{recipe.name}</h3>
                            <p className="recipe-card-description">{recipe.description}</p>
                            
                            <div className="recipe-section">
                                <h4 className="recipe-section-title">
                                    <ChefHat size={18} />
                                    Ingredients
                                </h4>
                                <ul className="recipe-list">
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="recipe-section">
                                <h4 className="recipe-section-title">
                                    <ChevronsRight size={18} />
                                    Instructions
                                </h4>
                                <ul className="recipe-list">
                                    {recipe.instructions.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleSubmitRecipe(recipe)}
                                className="recipe-generate-button"
                                style={{ width: '100%', marginTop: '20px' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Submit Recipe
                                    </>
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecipeGenerator;