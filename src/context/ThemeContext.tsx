import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeMode, getTheme, ColorScheme, spacing, borderRadius, typography, shadows } from '../theme';

interface ThemeContextType {
    mode: ThemeMode;
    colors: ColorScheme;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    typography: typeof typography;
    shadows: typeof shadows;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@emi_calculator_theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>(systemColorScheme === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                setMode(savedTheme);
            }
        } catch {
            // Silent fail for theme loading
        }
    };

    const saveTheme = async (newMode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch {
            // Silent fail for theme saving
        }
    };

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        saveTheme(newMode);
    };

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
        saveTheme(newMode);
    };

    const theme = getTheme(mode);

    const value: ThemeContextType = useMemo(() => ({
        mode,
        colors: theme.colors,
        spacing: theme.spacing,
        borderRadius: theme.borderRadius,
        typography: theme.typography,
        shadows: theme.shadows,
        toggleTheme,
        setTheme,
        isDark: mode === 'dark',
    }), [mode, theme, toggleTheme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
