import React from "react";
import ThemeToggle from "./ThemeToggle";

/**
 * Application Header component
 */

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <span>VibeFinder</span>
                    </div>
                    <nav className="nav-menu">
                        <a href="" className="nav-link">Home</a>
                        <a href="" className="nav-link">Favorites</a>
                        <a href="" className="nav-link">History</a>
                        <a href="" className="nav-link">Analytics</a>
                    </nav>

                    <div className="header-action">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;