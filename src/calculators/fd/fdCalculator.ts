// FD Calculator Utility Functions
// FD Formula: A = P × (1 + r/n)^(n×t)

export interface FDInput {
    principal: number;              // Principal amount in rupees
    annualRate: number;             // Annual interest rate in percentage
    years: number;                  // Investment duration in years
    compoundingFrequency: number;   // Times interest compounds per year
}

export interface FDResult {
    principal: number;              // Initial investment
    maturityAmount: number;         // Final maturity amount
    interestEarned: number;         // Total interest earned
    interestRate: number;           // Annual interest rate
    tenure: number;                 // Investment period in years
    compoundingFrequency: string;   // Compounding description
    effectiveRate: number;          // Effective annual rate
}

export type CompoundingType = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export const compoundingOptions: { id: CompoundingType; label: string; value: number }[] = [
    { id: 'monthly', label: 'Monthly', value: 12 },
    { id: 'quarterly', label: 'Quarterly', value: 4 },
    { id: 'half-yearly', label: 'Half-Yearly', value: 2 },
    { id: 'yearly', label: 'Yearly', value: 1 },
];

/**
 * Calculate FD Maturity using compound interest formula
 * A = P × (1 + r/n)^(n×t)
 */
export const calculateFD = (input: FDInput): FDResult => {
    const { principal, annualRate, years, compoundingFrequency } = input;

    // Handle edge cases
    if (principal <= 0 || years <= 0) {
        return {
            principal: 0,
            maturityAmount: 0,
            interestEarned: 0,
            interestRate: 0,
            tenure: 0,
            compoundingFrequency: 'N/A',
            effectiveRate: 0,
        };
    }

    // Get compounding label
    const compoundingLabel = compoundingOptions.find(
        c => c.value === compoundingFrequency
    )?.label || 'Quarterly';

    // If interest rate is 0, no growth
    if (annualRate === 0) {
        return {
            principal,
            maturityAmount: principal,
            interestEarned: 0,
            interestRate: 0,
            tenure: years,
            compoundingFrequency: compoundingLabel,
            effectiveRate: 0,
        };
    }

    // Convert annual rate to decimal
    const rate = annualRate / 100;

    // FD Maturity calculation: A = P × (1 + r/n)^(n×t)
    const n = compoundingFrequency;
    const t = years;
    const base = 1 + rate / n;
    const exponent = n * t;
    const maturityAmount = principal * Math.pow(base, exponent);

    const interestEarned = maturityAmount - principal;

    // Calculate effective annual rate: (1 + r/n)^n - 1
    const effectiveRate = (Math.pow(1 + rate / n, n) - 1) * 100;

    return {
        principal,
        maturityAmount: Math.round(maturityAmount),
        interestEarned: Math.round(interestEarned),
        interestRate: annualRate,
        tenure: years,
        compoundingFrequency: compoundingLabel,
        effectiveRate: Math.round(effectiveRate * 100) / 100,
    };
};

// FD Configuration
export interface FDConfig {
    minAmount: number;
    maxAmount: number;
    defaultAmount: number;
    minRate: number;
    maxRate: number;
    defaultRate: number;
    minYears: number;
    maxYears: number;
    defaultYears: number;
    amountStep: number;
    rateStep: number;
    yearsStep: number;
    defaultCompounding: number;
}

export const fdConfig: FDConfig = {
    minAmount: 10000,       // ₹10,000
    maxAmount: 10000000,    // ₹1,00,00,000 (1 Cr)
    defaultAmount: 100000,  // ₹1,00,000
    minRate: 1,             // 1%
    maxRate: 15,            // 15%
    defaultRate: 7,         // 7%
    minYears: 1,            // 1 year
    maxYears: 10,           // 10 years
    defaultYears: 5,        // 5 years
    amountStep: 10000,      // ₹10,000
    rateStep: 0.1,          // 0.1%
    yearsStep: 1,           // 1 year
    defaultCompounding: 4,  // Quarterly
};
