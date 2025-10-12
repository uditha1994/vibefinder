import React from "react";

/**
 * Loading spinner component
 * @param {string} - Spinner size (small, medium, large)
 * @param {string} - Loding message 
 */

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
    const sizeClass = `spinner-${size}`;

    return (
        <div className="loading-spinner">
            <div className={`spinner ${sizeClass}`}></div>
            {message && (
                <p className="loading-message">{message}</p>
            )}
        </div>
    )
}

export default LoadingSpinner;