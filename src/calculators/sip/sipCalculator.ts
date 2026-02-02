// SIP Calculator Utility Functions
// SIP Formula: FV = P × [{(1 + r)^n – 1} / r] × (1 + r)

export interface SIPInput {
    monthlyInvestment: number;  // Monthly SIP amount in rupees
    annualReturn: number;       // Expected annual return in percentage
    years: number;              // Investment duration in years
}

export interface SIPResult {
    monthlyInvestment: number;  // Monthly investment amount
    totalInvested: number;      // Total amount invested
    futureValue: number;        // Maturity value
    wealthGain: number;         // Profit/returns
    annualReturn: number;       // Annual return rate
    years: number;              // Investment period
}

/**
 * Calculate SIP Returns using standard formula
 * FV = P × [{(1 + r)^n – 1} / r] × (1 + r)
 */
export const calculateSIP = (input: SIPInput): SIPResult => {
    const { monthlyInvestment, annualReturn, years } = input;

    // Handle edge cases
    if (monthlyInvestment <= 0 || years <= 0) {
        return {
            monthlyInvestment: 0,
            totalInvested: 0,
            futureValue: 0,
            wealthGain: 0,
            annualReturn: 0,
            years: 0,
        };
    }

    const months = years * 12;
    const totalInvested = monthlyInvestment * months;

    // If return rate is 0, no growth
    if (annualReturn === 0) {
        return {
            monthlyInvestment,
            totalInvested,
            futureValue: totalInvested,
            wealthGain: 0,
            annualReturn: 0,
            years,
        };
    }

    // Monthly return rate (convert from percentage to decimal)
    const monthlyRate = annualReturn / 12 / 100;

    // SIP Future Value calculation
    const onePlusR = 1 + monthlyRate;
    const powerN = Math.pow(onePlusR, months);
    const futureValue = monthlyInvestment * ((powerN - 1) / monthlyRate) * onePlusR;

    const wealthGain = futureValue - totalInvested;

    return {
        monthlyInvestment,
        totalInvested: Math.round(totalInvested),
        futureValue: Math.round(futureValue),
        wealthGain: Math.round(wealthGain),
        annualReturn,
        years,
    };
};

// SIP Configuration
export interface SIPConfig {
    minAmount: number;
    maxAmount: number;
    defaultAmount: number;
    minReturn: number;
    maxReturn: number;
    defaultReturn: number;
    minYears: number;
    maxYears: number;
    defaultYears: number;
    amountStep: number;
    returnStep: number;
    yearsStep: number;
}

export const sipConfig: SIPConfig = {
    minAmount: 500,         // ₹500
    maxAmount: 100000,      // ₹1,00,000
    defaultAmount: 5000,    // ₹5,000
    minReturn: 1,           // 1%
    maxReturn: 30,          // 30%
    defaultReturn: 12,      // 12%
    minYears: 1,            // 1 year
    maxYears: 40,           // 40 years
    defaultYears: 10,       // 10 years
    amountStep: 500,        // ₹500
    returnStep: 0.5,        // 0.5%
    yearsStep: 1,           // 1 year
};
