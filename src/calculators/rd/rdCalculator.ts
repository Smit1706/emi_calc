// RD (Recurring Deposit) Calculator Utility Functions
// RD Formula: M = P × [{(1 + r/n)^(n×t) - 1} / (r/n)] × (1 + r/n)

export interface RDInput {
    monthlyDeposit: number;         // Monthly deposit amount in rupees
    annualRate: number;             // Annual interest rate in percentage
    years: number;                  // Investment duration in years
}

export interface RDResult {
    monthlyDeposit: number;         // Monthly deposit amount
    totalDeposits: number;          // Total amount deposited
    maturityAmount: number;         // Final maturity amount
    interestEarned: number;         // Total interest earned
    interestRate: number;           // Annual interest rate
    tenure: number;                 // Investment period in years
}

/**
 * Calculate RD Maturity
 * RD assumes quarterly compounding (as per most banks)
 * M = P × [{(1 + r/n)^(n×t) - 1} / (r/n)] × (1 + r/n)
 * For monthly deposits with quarterly compounding:
 * M = P × [((1 + i)^n - 1) / i] × (1 + i)
 * where i = quarterly rate, n = number of quarters
 */
export const calculateRD = (input: RDInput): RDResult => {
    const { monthlyDeposit, annualRate, years } = input;

    // Handle edge cases
    if (monthlyDeposit <= 0 || years <= 0) {
        return {
            monthlyDeposit: 0,
            totalDeposits: 0,
            maturityAmount: 0,
            interestEarned: 0,
            interestRate: 0,
            tenure: 0,
        };
    }

    const totalMonths = years * 12;
    const totalDeposits = monthlyDeposit * totalMonths;

    // If interest rate is 0, no growth
    if (annualRate === 0) {
        return {
            monthlyDeposit,
            totalDeposits,
            maturityAmount: totalDeposits,
            interestEarned: 0,
            interestRate: 0,
            tenure: years,
        };
    }

    // Monthly rate
    const monthlyRate = annualRate / 12 / 100;

    // RD calculation using compound interest formula for recurring deposits
    // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    // Where P = monthly deposit, r = monthly interest rate, n = number of months
    const maturityAmount = monthlyDeposit *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);

    const interestEarned = maturityAmount - totalDeposits;

    return {
        monthlyDeposit,
        totalDeposits: Math.round(totalDeposits),
        maturityAmount: Math.round(maturityAmount),
        interestEarned: Math.round(interestEarned),
        interestRate: annualRate,
        tenure: years,
    };
};

// RD Configuration
export interface RDConfig {
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
}

export const rdConfig: RDConfig = {
    minAmount: 500,         // ₹500
    maxAmount: 100000,      // ₹1,00,000
    defaultAmount: 5000,    // ₹5,000
    minRate: 1,             // 1%
    maxRate: 10,            // 10%
    defaultRate: 6.5,       // 6.5%
    minYears: 1,            // 1 year
    maxYears: 10,           // 10 years
    defaultYears: 5,        // 5 years
    amountStep: 500,        // ₹500
    rateStep: 0.1,          // 0.1%
    yearsStep: 1,           // 1 year
};
