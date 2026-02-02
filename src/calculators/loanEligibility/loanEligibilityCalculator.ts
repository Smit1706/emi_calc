// Loan Eligibility Calculator
// Calculates maximum loan amount based on income and obligations

export interface LoanEligibilityInput {
    monthlyIncome: number;          // Monthly income in rupees
    existingEMI: number;            // Existing EMI obligations (optional)
    interestRate: number;           // Annual interest rate in percentage
    tenureYears: number;            // Loan tenure in years
}

export interface LoanEligibilityResult {
    monthlyIncome: number;          // User's monthly income
    existingEMI: number;            // Existing EMI
    availableForEMI: number;        // Amount available for new EMI
    maxLoanAmount: number;          // Maximum eligible loan amount
    emi: number;                    // EMI for max loan
    interestRate: number;           // Interest rate used
    tenure: number;                 // Tenure in years
    totalPayment: number;           // Total payment over tenure
    totalInterest: number;          // Total interest paid
}

// Banks typically allow 40-50% of income for EMI obligations
const FOIR = 0.50; // Fixed Obligations to Income Ratio (50%)

/**
 * Calculate maximum eligible loan amount based on income
 * 
 * Logic:
 * 1. Available EMI = (Monthly Income × FOIR) - Existing EMI
 * 2. Max Loan = EMI × [(1+r)^n - 1] / [r × (1+r)^n]
 *    where r = monthly rate, n = months
 */
export const calculateLoanEligibility = (input: LoanEligibilityInput): LoanEligibilityResult => {
    const { monthlyIncome, existingEMI, interestRate, tenureYears } = input;

    // Handle edge cases
    if (monthlyIncome <= 0 || tenureYears <= 0) {
        return {
            monthlyIncome: 0,
            existingEMI: 0,
            availableForEMI: 0,
            maxLoanAmount: 0,
            emi: 0,
            interestRate: 0,
            tenure: 0,
            totalPayment: 0,
            totalInterest: 0,
        };
    }

    // Calculate available EMI capacity
    const maxAllowedEMI = monthlyIncome * FOIR;
    const availableForEMI = Math.max(0, maxAllowedEMI - existingEMI);

    // If no capacity for new EMI
    if (availableForEMI <= 0) {
        return {
            monthlyIncome,
            existingEMI,
            availableForEMI: 0,
            maxLoanAmount: 0,
            emi: 0,
            interestRate,
            tenure: tenureYears,
            totalPayment: 0,
            totalInterest: 0,
        };
    }

    // If interest rate is 0
    if (interestRate === 0) {
        const maxLoan = availableForEMI * tenureYears * 12;
        return {
            monthlyIncome,
            existingEMI,
            availableForEMI,
            maxLoanAmount: Math.round(maxLoan),
            emi: Math.round(availableForEMI),
            interestRate: 0,
            tenure: tenureYears,
            totalPayment: Math.round(maxLoan),
            totalInterest: 0,
        };
    }

    // Calculate max loan using reverse EMI formula
    // P = EMI × [(1+r)^n - 1] / [r × (1+r)^n]
    const monthlyRate = interestRate / 12 / 100;
    const n = tenureYears * 12;
    const onePlusRPowerN = Math.pow(1 + monthlyRate, n);

    const maxLoanAmount = availableForEMI * (onePlusRPowerN - 1) / (monthlyRate * onePlusRPowerN);
    const totalPayment = availableForEMI * n;
    const totalInterest = totalPayment - maxLoanAmount;

    return {
        monthlyIncome,
        existingEMI,
        availableForEMI: Math.round(availableForEMI),
        maxLoanAmount: Math.round(maxLoanAmount),
        emi: Math.round(availableForEMI),
        interestRate,
        tenure: tenureYears,
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
    };
};

// Loan Eligibility Configuration
export interface LoanEligibilityConfig {
    minIncome: number;
    maxIncome: number;
    defaultIncome: number;
    minEMI: number;
    maxEMI: number;
    defaultEMI: number;
    minRate: number;
    maxRate: number;
    defaultRate: number;
    minTenure: number;
    maxTenure: number;
    defaultTenure: number;
    incomeStep: number;
    emiStep: number;
    rateStep: number;
    tenureStep: number;
}

export const loanEligibilityConfig: LoanEligibilityConfig = {
    minIncome: 10000,       // ₹10,000
    maxIncome: 1000000,     // ₹10,00,000
    defaultIncome: 50000,   // ₹50,000
    minEMI: 0,              // ₹0
    maxEMI: 200000,         // ₹2,00,000
    defaultEMI: 0,          // ₹0 (no existing EMI)
    minRate: 5,             // 5%
    maxRate: 20,            // 20%
    defaultRate: 9,         // 9%
    minTenure: 1,           // 1 year
    maxTenure: 30,          // 30 years
    defaultTenure: 20,      // 20 years
    incomeStep: 5000,       // ₹5,000
    emiStep: 1000,          // ₹1,000
    rateStep: 0.5,          // 0.5%
    tenureStep: 1,          // 1 year
};
