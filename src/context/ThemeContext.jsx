/**
 * React Hooks
 * 
 * 01- createContext - transfer data between components
 *                      parent component ---> child component
 * 02 - useContext
 * 
 * 03 - useState - manage states of a component
 * 
 * 04 - useEffect - manage component life cycle. (API calls, eventlisteners)
 */
// import React, { createContext, useContext, useState, useEffect, use } from "react";

// const UserContext = createContext(); // create a context

// function App() {
//     const [user, setUser] = useState("Jone"); //create a state

//     useEffect(() => {
//         console.log('Used changed:', user);
//     }, [user]);

//     return (
//         //context provider
//         <UserContext.Provider value={user}>
//             <ChildComponent />
//         </UserContext.Provider>
//     )
// }

// function ChildComponent() {
//     //use the context
//     const user = useContext(UserContext);
//     return <h1>Hello {user}</h1>
// }

import React, { createContext, useContext, useState, useEffect, use } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        //check localstorage for saved theme reference
        const savedTheme = localStorage.getItem('vibefinder-theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    useEffect(() => {
        //apply theme to document root
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        //save theme preference to localstorage
        localStorage.setItem('vibefinder-theme', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};