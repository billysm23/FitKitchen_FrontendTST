import axios from 'axios';

export async function generateRecipes(ingredients) {
  try {
    const { data } = await axios.post(
      'https://smart-health-tst.up.railway.app/api/recipes', 
      { ingredients },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_RECIPE_API_KEY
        }
      }
    );

    return data.recipes;
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    return [];
  }
}