import api from './axios.js';

const recipeApi = api.create({
    baseURL: 'https://smart-health-tst.up.railway.app/api',
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.REACT_APP_RECIPE_API_KEY
    }
});

export const recipeService = {
    async generateRecipes(ingredients) {
        try {
            const response = await recipeApi.post('/recipes', { ingredients });
            return response.data.recipes;
        } catch (error) {
            console.error('Recipe generation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to generate recipes');
        }
    }
};