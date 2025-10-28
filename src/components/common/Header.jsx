import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../config/firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

/**
 * Application Header component
 */

const Header = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/">
                    <div className="logo">
                        <span>VibeFinder</span>
                    </div>
                </Link>

                <div className="navbar-menu">
                    <Link
                        to="/"
                        className={`navbar-link ${location.pathname ===
                            '/' ? 'active' : ''}`}
                    >Home
                    </Link>
                    <Link
                        to="/favorite"
                        className={`navbar-link ${location.pathname ===
                            '/favorite' ? 'active' : ''}`}
                    >Favorites
                    </Link>
                    <Link
                        to="/discover"
                        className={`navbar-link ${location.pathname ===
                            '/discover' ? 'active' : ''}`}
                    >Discover
                    </Link>
                    {user && (
                        <Link
                            to="/profile"
                            className={`navbar-link ${location.pathname ===
                                '/profile' ? 'active' : ''}`}
                        >Profile</Link>
                    )}
                </div>

                <div className="navbar-controls">
                    {/* theme toggle */}
                    <button
                        className="theme-toggle"
                        aria-label="Toggle theme"
                        onClick={toggleTheme}
                    >
                        {isDarkMode ? '☀️' : '🌛'}
                    </button>

                    {/* auth button */}
                    {user ? (
                        <div className="user-menu">
                            <img src={user.photoURL || ''} alt="Profile" className="user-avatar" />
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>
                    )}

                    {/* menu toggle */}
                    <button className="mobile-menu-toggle"
                        aria-label="Toggle menu" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* mobile menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/discover" onClick={() => setIsMenuOpen(false)}>Discover</Link>
                    {user && (
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    )}
                    {!user && (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Header;