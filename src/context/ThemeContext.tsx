import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    isLowData: boolean;
    toggleLowData: () => void;
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    isDarkMode: boolean; // Computed value for current state
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLowData, setIsLowData] = useState(() => {
        const saved = localStorage.getItem('lowDataMode');
        return saved === 'true';
    });

    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('themePreference') as ThemeMode;
        if (saved && ['light', 'dark', 'system'].includes(saved)) return saved;
        return 'system';
    });

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        localStorage.setItem('lowDataMode', isLowData.toString());
        if (isLowData) {
            document.documentElement.classList.add('low-data');
        } else {
            document.documentElement.classList.remove('low-data');
        }
    }, [isLowData]);

    useEffect(() => {
        const updateTheme = () => {
            let darkMode = false;
            if (theme === 'system') {
                darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            } else {
                darkMode = theme === 'dark';
            }

            setIsDarkMode(darkMode);
            localStorage.setItem('themePreference', theme);

            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();

        // Listen for system changes if in 'system' mode
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const listener = () => updateTheme();
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [theme]);

    const toggleLowData = () => setIsLowData(prev => !prev);
    const setTheme = (newTheme: ThemeMode) => setThemeState(newTheme);

    return (
        <ThemeContext.Provider value={{ isLowData, toggleLowData, theme, setTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
