import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

export default function Layout({ children }) {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        { name: 'About', href: '/about', current: location.pathname === '/about' },
    ];

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-flex">
                        <div className="navbar-left">
                            <div className="navbar-brand">
                                <img
                                    className="brand-logo"
                                    src="/../../../icon.png"
                                    alt="FitKitchen"
                                />
                            </div>
                            <div className="desktop-menu">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`nav-link ${item.current ? 'active' : ''}`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="navbar-right">
                            {currentUser ? (
                                <div className="user-menu">
                                    <button 
                                        className="user-button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <div className="user-avatar">
                                            {currentUser.username.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                    <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                                        <button
                                            onClick={logout}
                                            className="dropdown-item"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="login-button">
                                    Get Started
                                </Link>
                            )}

                            <button
                                className="mobile-menu-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <span>✕</span>
                                ) : (
                                    <span>☰</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                        <div className="mobile-nav">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`mobile-nav-link ${item.current ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        {currentUser && (
                            <div className="mobile-user-info">
                                <div className="user-info-text">{currentUser.username}</div>
                                <div className="user-info-email">{currentUser.email}</div>
                                <button onClick={logout} className="mobile-logout">
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="content-container">
                    {children}
                </div>
            </main>
        </div>
    );
}