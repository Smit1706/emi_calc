// Prepayment / Foreclosure Calculator
// Calculates interest savings and reduced tenure from prepayment

export interface PrepaymentInput {
    loanAmount: number;             // Original loan amount
    interestRate: number;           // Annual interest rate in percentage
    tenureYears: number;            // Original loan tenure in years
    prepaymentAmount: number;       // Prepayment amount
    prepaymentYear: number;         // Year of prepayment (1, 2, 3, etc.)
}

export interface PrepaymentResult {
    // Original loan details
    originalLoanAmount: number;
    originalTenure: number;
    originalEMI: number;
    originalTotalPayment: number;
    originalTotalInterest: number;

    // After prepayment
    prepaymentAmount: number;
    prepaymentYear: number;
    outstandingBeforePrepayment: number;
    newOutstanding: number;
    newTenureMonths: number;
    newTotalPayment: number;
    newTotalInterest: number;

    // Savings
    interestSaved: number;
    tenureReduced: number;          // Months saved

    // Additional info
    interestRate: number;
}

/**
 * Calculate EMI using standard formula
 * EMI = P × r × (1+r)^n / [(1+r)^n - 1]
 */
const calculateEMI = (principal: number, annualRate: number, months: number): number => {
    if (principal <= 0 || months <= 0) return 0;
    if (annualRate === 0) return principal / months;

    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, months);
    return principal * r * factor / (factor - 1);
};

/**
 * Calculate outstanding balance at a specific month
 * Outstanding = P × [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
 */
const calculateOutstanding = (
    principal: number,
    annualRate: number,
    totalMonths: number,
    paidMonths: number
): number => {
    if (annualRate === 0) {
        return principal * (totalMonths - paidMonths) / totalMonths;
    }

    const r = annualRate / 12 / 100;
    const factorN = Math.pow(1 + r, totalMonths);
    const factorP = Math.pow(1 + r, paidMonths);

    return principal * (factorN - factorP) / (factorN - 1);
};

/**
 * Calculate months needed to pay off a loan
 * n = log[(EMI) / (EMI - P×r)] / log(1+r)
 */
const calculateTenure = (principal: number, emi: number, annualRate: number): number => {
    if (principal <= 0 || emi <= 0) return 0;
    if (annualRate === 0) return Math.ceil(principal / emi);

    const r = annualRate / 12 / 100;
    const monthlyInterest = principal * r;

    // If EMI is less than monthly interest, loan can't be paid off
    if (emi <= monthlyInterest) return Infinity;

    const n = Math.log(emi / (emi - monthlyInterest)) / Math.log(1 + r);
    return Math.ceil(n);
};

/**
 * Calculate prepayment impact
 */
export const calculatePrepayment = (input: PrepaymentInput): PrepaymentResult => {
    const { loanAmount, interestRate, tenureYears, prepaymentAmount, prepaymentYear } = input;

    const originalMonths = tenureYears * 12;

    // Handle edge cases
    if (loanAmount <= 0 || tenureYears <= 0 || prepaymentAmount <= 0) {
        return {
            originalLoanAmount: loanAmount,
            originalTenure: tenureYears,
            originalEMI: 0,
            originalTotalPayment: 0,
            originalTotalInterest: 0,
            prepaymentAmount: 0,
            prepaymentYear: 0,
            outstandingBeforePrepayment: 0,
            newOutstanding: 0,
            newTenureMonths: 0,
            newTotalPayment: 0,
            newTotalInterest: 0,
            interestSaved: 0,
            tenureReduced: 0,
            interestRate,
        };
    }

    // Original loan calculations
    const originalEMI = calculateEMI(loanAmount, interestRate, originalMonths);
    const originalTotalPayment = originalEMI * originalMonths;
    const originalTotalInterest = originalTotalPayment - loanAmount;

    // Calculate outstanding at prepayment time
    const paidMonths = (prepaymentYear - 1) * 12; // Prepayment at start of that year
    const paidBeforePrepayment = originalEMI * paidMonths;

    let outstandingBeforePrepayment: number;
    if (paidMonths >= originalMonths) {
        // Loan already paid off
        outstandingBeforePrepayment = 0;
    } else {
        outstandingBeforePrepayment = calculateOutstanding(
            loanAmount,
            interestRate,
            originalMonths,
            paidMonths
        );
    }

    // After prepayment
    const effectivePrepayment = Math.min(prepaymentAmount, outstandingBeforePrepayment);
    const newOutstanding = Math.max(0, outstandingBeforePrepayment - effectivePrepayment);

    // Calculate new tenure with same EMI
    let newRemainingMonths = 0;
    let newTotalPaymentAfterPrepayment = 0;

    if (newOutstanding > 0 && originalEMI > 0) {
        newRemainingMonths = calculateTenure(newOutstanding, originalEMI, interestRate);
        if (newRemainingMonths === Infinity) {
            newRemainingMonths = originalMonths - paidMonths;
        }
        newTotalPaymentAfterPrepayment = originalEMI * newRemainingMonths;
    }

    // Total new payment = paid before + prepayment + remaining
    const newTotalPayment = paidBeforePrepayment + effectivePrepayment + newTotalPaymentAfterPrepayment;
    const newTotalInterest = newTotalPayment - loanAmount;

    // Savings
    const interestSaved = Math.max(0, originalTotalInterest - newTotalInterest);
    const originalRemainingMonths = originalMonths - paidMonths;
    const tenureReduced = Math.max(0, originalRemainingMonths - newRemainingMonths);

    return {
        originalLoanAmount: Math.round(loanAmount),
        originalTenure: tenureYears,
        originalEMI: Math.round(originalEMI),
        originalTotalPayment: Math.round(originalTotalPayment),
        originalTotalInterest: Math.round(originalTotalInterest),
        prepaymentAmount: Math.round(effectivePrepayment),
        prepaymentYear,
        outstandingBeforePrepayment: Math.round(outstandingBeforePrepayment),
        newOutstanding: Math.round(newOutstanding),
        newTenureMonths: newRemainingMonths,
        newTotalPayment: Math.round(newTotalPayment),
        newTotalInterest: Math.round(newTotalInterest),
        interestSaved: Math.round(interestSaved),
        tenureReduced,
        interestRate,
    };
};

// Prepayment Configuration
export interface PrepaymentConfig {
    minLoan: number;
    maxLoan: number;
    defaultLoan: number;
    minRate: number;
    maxRate: number;
    defaultRate: number;
    minTenure: number;
    maxTenure: number;
    defaultTenure: number;
    minPrepayment: number;
    maxPrepayment: number;
    defaultPrepayment: number;
    minYear: number;
    maxYear: number;
    defaultYear: number;
    loanStep: number;
    rateStep: number;
    tenureStep: number;
    prepaymentStep: number;
}

export const prepaymentConfig: PrepaymentConfig = {
    minLoan: 100000,        // ₹1,00,000
    maxLoan: 10000000,      // ₹1,00,00,000 (1 Cr)
    defaultLoan: 2000000,   // ₹20,00,000
    minRate: 5,             // 5%
    maxRate: 20,            // 20%
    defaultRate: 9,         // 9%
    minTenure: 1,           // 1 year
    maxTenure: 30,          // 30 years
    defaultTenure: 20,      // 20 years
    minPrepayment: 10000,   // ₹10,000
    maxPrepayment: 5000000, // ₹50,00,000
    defaultPrepayment: 200000, // ₹2,00,000
    minYear: 1,             // 1st year
    maxYear: 30,            // 30th year
    defaultYear: 3,         // 3rd year
    loanStep: 50000,        // ₹50,000
    rateStep: 0.5,          // 0.5%
    tenureStep: 1,          // 1 year
    prepaymentStep: 10000,  // ₹10,000
};
