import React from "react";

/**
 * Theme toggle component for switching between light and dark modes
 */
const ThemeToggle = () => {
    return (
        <button
            className="theme-toggle"
            title="light"
            aria-label="light"
        >
            <span className="theme-icon">☀️</span>
            <span className="theme-text">
                Light
            </span>
        </button>
    )
}

export default ThemeToggle;