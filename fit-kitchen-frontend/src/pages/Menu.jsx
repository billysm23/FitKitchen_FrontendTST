import React from 'react';
import RecipeGenerator from '../component/RecipeGenerator';

export default function Menu() {
    function MenuPage() {
        return (
            <div>
                <h1>Menu Generator</h1>
                <RecipeGenerator />
            </div>
        );
    }
    return (
        <div>
            <h1>Menu Page</h1>
            <p>Welcome to the Menu Page!</p>
            <p>Here you can explore our delicious offerings.</p>
            <MenuPage />
        </div>
    );
}