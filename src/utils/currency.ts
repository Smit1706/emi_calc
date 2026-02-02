// Currency Utility - Display-only formatting
// Does NOT affect calculations, only formatting & symbols

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    name: string;
    locale: string;
    flag: string;
}

// Supported currencies (Phase 1)
export const currencies: Record<CurrencyCode, CurrencyConfig> = {
    INR: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
        locale: 'en-IN',
        flag: 'IN',
    },
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        locale: 'en-US',
        flag: 'US',
    },
    EUR: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        locale: 'de-DE',
        flag: 'EU',
    },
    GBP: {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound',
        locale: 'en-GB',
        flag: 'UK',
    },
    AED: {
        code: 'AED',
        symbol: 'د.إ',
        name: 'UAE Dirham',
        locale: 'ar-AE',
        flag: 'AE',
    },
};

// Default currency
export const DEFAULT_CURRENCY: CurrencyCode = 'INR';

// Currency list for picker
export const currencyList: CurrencyConfig[] = Object.values(currencies);

/**
 * Format a number as currency with locale-aware formatting
 * Display-only - does not convert values
 */
export const formatCurrencyValue = (
    amount: number,
    currencyCode: CurrencyCode = DEFAULT_CURRENCY
): string => {
    const config = currencies[currencyCode];

    if (isNaN(amount) || !isFinite(amount)) {
        return `${config.symbol} 0`;
    }

    try {
        // Use Intl.NumberFormat for locale-aware formatting
        const formatter = new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        return formatter.format(amount);
    } catch {
        // Fallback for environments without full Intl support
        const formatted = Math.round(amount).toLocaleString(config.locale);
        return `${config.symbol} ${formatted}`;
    }
};

/**
 * Format number with locale-aware thousand separators (no currency symbol)
 */
export const formatNumber = (
    value: number,
    currencyCode: CurrencyCode = DEFAULT_CURRENCY
): string => {
    const config = currencies[currencyCode];

    if (isNaN(value) || !isFinite(value)) {
        return '0';
    }

    try {
        return Math.round(value).toLocaleString(config.locale);
    } catch {
        return Math.round(value).toString();
    }
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currencyCode: CurrencyCode): string => {
    return currencies[currencyCode]?.symbol ?? '₹';
};

/**
 * Get currency display name
 */
export const getCurrencyDisplayName = (currencyCode: CurrencyCode): string => {
    const config = currencies[currencyCode];
    return `${config.name} (${config.symbol})`;
};
