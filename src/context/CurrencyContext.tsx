// Currency Context - App-wide currency state management
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    CurrencyCode,
    CurrencyConfig,
    DEFAULT_CURRENCY,
    currencies,
    formatCurrencyValue,
    formatNumber as formatNumUtil,
    getCurrencySymbol,
} from '../utils/currency';

const CURRENCY_STORAGE_KEY = '@finance_calc_currency';

interface CurrencyContextType {
    currency: CurrencyCode;
    currencyConfig: CurrencyConfig;
    setCurrency: (code: CurrencyCode) => Promise<void>;
    formatCurrency: (amount: number) => string;
    formatNumber: (value: number) => string;
    symbol: string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
    children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
    const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved currency on mount
    useEffect(() => {
        const loadCurrency = async () => {
            try {
                const saved = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
                if (saved && currencies[saved as CurrencyCode]) {
                    setCurrencyState(saved as CurrencyCode);
                }
            } catch (error) {
                console.error('Error loading currency:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCurrency();
    }, []);

    // Set and persist currency
    const setCurrency = useCallback(async (code: CurrencyCode) => {
        try {
            await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, code);
            setCurrencyState(code);
        } catch (error) {
            console.error('Error saving currency:', error);
        }
    }, []);

    // Format currency with current selection
    const formatCurrency = useCallback((amount: number) => {
        return formatCurrencyValue(amount, currency);
    }, [currency]);

    // Format number with current locale
    const formatNumber = useCallback((value: number) => {
        return formatNumUtil(value, currency);
    }, [currency]);

    const value: CurrencyContextType = {
        currency,
        currencyConfig: currencies[currency],
        setCurrency,
        formatCurrency,
        formatNumber,
        symbol: getCurrencySymbol(currency),
        isLoading,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export { CurrencyCode, CurrencyConfig, currencies, DEFAULT_CURRENCY };
