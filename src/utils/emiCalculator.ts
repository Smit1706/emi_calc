// EMI Calculator Utility Functions
// Standard EMI formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

export interface EMIInput {
    principal: number;      // Loan amount in rupees
    annualRate: number;     // Annual interest rate in percentage
    tenureMonths: number;   // Loan tenure in months
}

export interface EMIResult {
    emi: number;            // Monthly EMI amount
    totalPayment: number;   // Total amount payable
    totalInterest: number;  // Total interest payable
    principal: number;      // Principal amount
}

/**
 * Calculate EMI using the standard formula
 * EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
 */
export const calculateEMI = (input: EMIInput): EMIResult => {
    const { principal, annualRate, tenureMonths } = input;

    // Handle edge cases
    if (principal <= 0 || tenureMonths <= 0) {
        return {
            emi: 0,
            totalPayment: 0,
            totalInterest: 0,
            principal: 0,
        };
    }

    // If interest rate is 0, simple division
    if (annualRate === 0) {
        const emi = principal / tenureMonths;
        return {
            emi: Math.round(emi),
            totalPayment: principal,
            totalInterest: 0,
            principal,
        };
    }

    // Monthly interest rate (convert from percentage to decimal)
    const monthlyRate = annualRate / 12 / 100;

    // EMI calculation
    const onePlusR = 1 + monthlyRate;
    const powerN = Math.pow(onePlusR, tenureMonths);
    const emi = (principal * monthlyRate * powerN) / (powerN - 1);

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    return {
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        principal,
    };
};

/**
 * Format number to Indian currency format (e.g., ₹ 1,00,000)
 */
export const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
        // Crores
        return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
        // Lakhs
        return `₹ ${(amount / 100000).toFixed(2)} L`;
    }

    // Indian number format
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });
    return formatter.format(amount);
};

/**
 * Format number with Indian number system
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Parse formatted currency string back to number
 */
export const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[₹,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

/**
 * Loan type configurations
 */
export type LoanType = 'personal' | 'home' | 'car' | 'education';

export interface LoanTypeConfig {
    id: LoanType;
    name: string;
    icon: string;
    minAmount: number;
    maxAmount: number;
    defaultAmount: number;
    minRate: number;
    maxRate: number;
    defaultRate: number;
    minTenure: number;
    maxTenure: number;
    defaultTenure: number;
    amountStep: number;
    rateStep: number;
    tenureStep: number;
}

// Global limits (apply to all loan types)
export const GLOBAL_LIMITS = {
    amount: {
        min: 50000,        // ₹50,000
        max: 5000000,      // ₹50,00,000 (5L)
        step: 1000,        // ₹1,000
        default: 100000,   // ₹1,00,000
    },
    rate: {
        min: 1.0,          // 1.0%
        max: 30.0,         // 30.0%
        step: 0.1,         // 0.1%
        default: 6.5,      // 6.5%
    },
    tenure: {
        min: 1,            // 1 year
        max: 30,           // 30 years
        step: 1,           // 1 year
        default: 5,        // 5 years
    },
};

export const loanTypes: Record<LoanType, LoanTypeConfig> = {
    personal: {
        id: 'personal',
        name: 'Personal Loan',
        icon: '👤',
        minAmount: GLOBAL_LIMITS.amount.min,
        maxAmount: GLOBAL_LIMITS.amount.max,
        defaultAmount: 50000,       // ₹50,000 (minimum)
        minRate: GLOBAL_LIMITS.rate.min,
        maxRate: GLOBAL_LIMITS.rate.max,
        defaultRate: 12.0,          // 12.0%
        minTenure: GLOBAL_LIMITS.tenure.min,
        maxTenure: GLOBAL_LIMITS.tenure.max,
        defaultTenure: 2,           // 2 years
        amountStep: GLOBAL_LIMITS.amount.step,
        rateStep: GLOBAL_LIMITS.rate.step,
        tenureStep: GLOBAL_LIMITS.tenure.step,
    },
    home: {
        id: 'home',
        name: 'Home Loan',
        icon: '🏠',
        minAmount: GLOBAL_LIMITS.amount.min,
        maxAmount: GLOBAL_LIMITS.amount.max,
        defaultAmount: 2000000,     // ₹20,00,000 (20L)
        minRate: GLOBAL_LIMITS.rate.min,
        maxRate: GLOBAL_LIMITS.rate.max,
        defaultRate: 8.5,           // 8.5%
        minTenure: GLOBAL_LIMITS.tenure.min,
        maxTenure: GLOBAL_LIMITS.tenure.max,
        defaultTenure: 20,          // 20 years
        amountStep: GLOBAL_LIMITS.amount.step,
        rateStep: GLOBAL_LIMITS.rate.step,
        tenureStep: GLOBAL_LIMITS.tenure.step,
    },
    car: {
        id: 'car',
        name: 'Car Loan',
        icon: '🚗',
        minAmount: GLOBAL_LIMITS.amount.min,
        maxAmount: GLOBAL_LIMITS.amount.max,
        defaultAmount: 500000,      // ₹5,00,000 (5L)
        minRate: GLOBAL_LIMITS.rate.min,
        maxRate: GLOBAL_LIMITS.rate.max,
        defaultRate: 9.0,           // 9.0%
        minTenure: GLOBAL_LIMITS.tenure.min,
        maxTenure: GLOBAL_LIMITS.tenure.max,
        defaultTenure: 5,           // 5 years
        amountStep: GLOBAL_LIMITS.amount.step,
        rateStep: GLOBAL_LIMITS.rate.step,
        tenureStep: GLOBAL_LIMITS.tenure.step,
    },
    education: {
        id: 'education',
        name: 'Education Loan',
        icon: '🎓',
        minAmount: GLOBAL_LIMITS.amount.min,
        maxAmount: GLOBAL_LIMITS.amount.max,
        defaultAmount: 200000,      // ₹2,00,000 (2L)
        minRate: GLOBAL_LIMITS.rate.min,
        maxRate: GLOBAL_LIMITS.rate.max,
        defaultRate: 6.5,           // 6.5%
        minTenure: GLOBAL_LIMITS.tenure.min,
        maxTenure: GLOBAL_LIMITS.tenure.max,
        defaultTenure: 7,           // 7 years
        amountStep: GLOBAL_LIMITS.amount.step,
        rateStep: GLOBAL_LIMITS.rate.step,
        tenureStep: GLOBAL_LIMITS.tenure.step,
    },
};
