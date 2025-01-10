import { ChevronDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Menu.css';

const MENU_CATEGORIES = [
    { name: 'Lunch' },
    { name: 'Dinner' },
    { name: 'Breakfast' },
    { name: 'Smoothies' },
    { name: 'Gluten-Free' },
    { name: 'Vegan' },
    { name: 'Snack' },
    { name: 'High-Protein' },
    { name: 'Salads' },
    { name: 'Low-Carb' }
];

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const initialFilters = {
        minCalories: '',
        maxCalories: '',
        category: 'all'
    };
    const [tempFilters, setTempFilters] = useState(initialFilters);
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(menus.length / itemsPerPage);

    const getCurrentPageMenus = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return menus.slice(startIndex, endIndex);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let endpoint = '/api/menu/search';
                const queryParams = new URLSearchParams();
                
                if (activeFilters.category && activeFilters.category !== 'all') {
                    endpoint = `/api/menu/category/${activeFilters.category}`;
                }

                if (endpoint === '/api/menu/search') {
                    if (searchTerm) {
                        queryParams.append('search', searchTerm);
                    }
                    if (activeFilters.minCalories) {
                        queryParams.append('minCalories', activeFilters.minCalories);
                    }
                    if (activeFilters.maxCalories) {
                        queryParams.append('maxCalories', activeFilters.maxCalories);
                    }
                }

                if (endpoint.includes('/category/') && (activeFilters.minCalories || activeFilters.maxCalories)) {
                    if (activeFilters.minCalories) {
                        queryParams.append('minCalories', activeFilters.minCalories);
                    }
                    if (activeFilters.maxCalories) {
                        queryParams.append('maxCalories', activeFilters.maxCalories);
                    }
                }

                const response = await api.get(`${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
                
                if (response.success) {
                    setMenus(response.data);
                    setTotalItems(response.data.length);
                }
            } catch (error) {
                console.error('Error fetching menus:', error);
                setError('Failed to load menus');
                toast.error('Failed to load menus');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm, activeFilters]);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchInput = e.target.elements.search.value;
        setSearchTerm(searchInput);
    };

    const handleCategoryChange = (category) => {
        setTempFilters(prev => ({
            ...prev,
            category
        }));
    };

    const handleCalorieFilterChange = (e) => {
        const { name, value } = e.target;
        const numValue = value === '' ? '' : Number(value);

        if (value !== '' && isNaN(numValue)) {
            toast.error('Please enter a valid number');
            return;
        }

        setTempFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const applyFilters = () => {
        if (tempFilters.minCalories && tempFilters.maxCalories) {
            if (Number(tempFilters.minCalories) > Number(tempFilters.maxCalories)) {
                toast.error('Minimum calories cannot be greater than maximum calories');
                return;
            }
        }

        setActiveFilters(tempFilters);
        setSelectedCategory(tempFilters.category);
        setShowFilters(false);
        setCurrentPage(1);
    };

    const renderPagination = () => {
        return (
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="menu-page">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="menu-page">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="menu-page">
            <div className="menu-header">
                <h1 className="menu-title">Browse Our Menu</h1>
                <p className="menu-subtitle">Discover our selection of healthy, delicious meals</p>
            </div>

            <div className="menu-controls">
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search meals..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <Search size={20} />
                    </button>
                </form>

                <button 
                    className="filter-toggle"
                    onClick={toggleFilters}
                >
                    <Filter size={20} />
                    Filters
                    <ChevronDown 
                        size={16} 
                        className={`filter-arrow ${showFilters ? 'open' : ''}`}
                    />
                </button>
            </div>

            {showFilters && (
                <div className="filter-panel">
                    <div className="filter-group">
                        <label className="filter-label">Calories Range:</label>
                        <div className="calorie-inputs">
                            <input
                                type="number"
                                name="minCalories"
                                value={tempFilters.minCalories}
                                onChange={handleCalorieFilterChange}
                                placeholder="Min"
                                className="calorie-input"
                                min="0"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                name="maxCalories"
                                value={tempFilters.maxCalories}
                                onChange={handleCalorieFilterChange}
                                placeholder="Max"
                                className="calorie-input"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Categories:</label>
                        <div className="category-buttons">
                            <button
                                type="button"
                                className={`category-button ${tempFilters.category === 'all' ? 'active' : ''}`}
                                onClick={() => handleCategoryChange('all')}
                            >
                                All
                            </button>
                            {MENU_CATEGORIES.map(category => (
                                <button
                                    type="button"
                                    key={category.name}
                                    className={`category-button ${tempFilters.category === category.name ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category.name)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button 
                            type="button"
                            className="filter-button cancel"
                            onClick={() => {
                                setTempFilters(activeFilters);
                                setShowFilters(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="filter-button reset"
                            onClick={() => {
                                setTempFilters(initialFilters);
                                setActiveFilters(initialFilters);
                                setSelectedCategory('all');
                                setCurrentPage(1);
                            }}
                        >
                            Reset Filters
                        </button>
                        <button 
                            type="button"
                            className="filter-button apply"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                    <h5>Search and category filter cannot work together, but search can be done together with calorie filters and category filter can be done together with calorie filters.</h5>
                </div>
            )}

            <div className="menu-grid">
                {getCurrentPageMenus().map(menu => (
                    <div key={menu.id} className="menu-card">
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

                            {menu.category && (
                                <span className="menu-category">
                                    {menu.category.name}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <div className="menu-card">
                        <div className="menu-image-container">
                            <div className="menu-image placeholder">
                                <div className="recommend-container">
                                    <Link to="/recipe-generator" className="recommend-button">
                                        Recommend Menu
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="menu-content">
                            <div className="menu-macros">
                                <div className="macro-item">
                                    <span className="macro-value">
                                        Do you want to recommend menu to FitKitchen's chef? Click above
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            {renderPagination()}
        </div>
    );
};

export default Menu;