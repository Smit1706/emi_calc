import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,

    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { RangeSlider } from '../components/RangeSlider';

import { LoanSummary } from '../components/LoanSummary';
import { LoanTypeSelector } from '../components/LoanTypeSelector';
import {
    calculateEMI,
    formatNumber,
    LoanType,
    loanTypes,
} from '../utils/emiCalculator';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
    const { colors, spacing, borderRadius, typography, shadows, isDark, toggleTheme } = useTheme();

    // State - use Personal Loan defaults initially
    const [loanType, setLoanType] = useState<LoanType>('personal');
    const [principal, setPrincipal] = useState(loanTypes.personal.defaultAmount);
    const [interestRate, setInterestRate] = useState(loanTypes.personal.defaultRate);
    const [tenure, setTenure] = useState(loanTypes.personal.defaultTenure);

    // Get current loan type config
    const config = loanTypes[loanType];

    // Handle loan type change - use defaultAmount instead of minAmount
    const handleLoanTypeChange = useCallback((type: LoanType) => {
        setLoanType(type);
        const newConfig = loanTypes[type];
        setPrincipal(newConfig.defaultAmount);
        setInterestRate(newConfig.defaultRate);
        setTenure(newConfig.defaultTenure);
    }, []);
    
    const debounceTimer = useRef<NodeJS.Timeout>();
    
    const debounceUpdate = useCallback((updateFn: () => void) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(updateFn, 100);
    }, []);
    
    const handlePrincipalChange = useCallback((value: number) => {
        setPrincipal(value);
    }, []);
    
    const handleInterestRateChange = useCallback((value: number) => {
        setInterestRate(value);
    }, []);
    
    const handleTenureChange = useCallback((value: number) => {
        setTenure(value);
    }, []);

    // Calculate EMI
    const emiResult = useMemo(() => {
        return calculateEMI({
            principal,
            annualRate: interestRate,
            tenureMonths: tenure * 12, // Convert years to months
        });
    }, [principal, interestRate, tenure]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: typography.fontSize.xl,
            fontWeight: '700',
            color: colors.text,
        },
        subtitle: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: spacing.xs,
        },
        themeButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.sm,
        },
        themeIcon: {
            fontSize: 20,
        },
        content: {
            flex: 1,
            paddingHorizontal: spacing.md,
        },
        section: {
            backgroundColor: colors.surfaceElevated,
            borderRadius: borderRadius.lg,
            padding: spacing.sm,
            marginBottom: spacing.sm,
            ...shadows.md,
        },
        sectionTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.md,
        },
        summarySection: {
            flex: 1,
        },


        totalAmountContainer: {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 16,
            padding: spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.primary,
        },
        totalLabel: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
        },
        totalValue: {
            fontSize: typography.fontSize.lg,
            fontWeight: '700',
            color: colors.text,
        },
    });

    const formatAmount = (value: number) => formatNumber(value);

    const formatAmountMin = (value: number) => {
        if (value >= 10000000) return `Min ₹${(value / 10000000).toFixed(1)} Cr`;
        if (value >= 100000) return `Min ₹${(value / 100000).toFixed(0)} L`;
        return `Min ₹${formatNumber(value)}`;
    };

    const formatAmountMax = (value: number) => {
        if (value >= 10000000) return `Max ₹${(value / 10000000).toFixed(0)} Cr`;
        if (value >= 100000) return `Max ₹${(value / 100000).toFixed(0)} L`;
        return `Max ₹${formatNumber(value)}`;
    };



    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>EMI Calculator</Text>
                        <Text style={styles.subtitle}>Calculate your loan EMI instantly</Text>
                    </View>
                    <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                        <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                {/* Loan Type Selector */}
                <LoanTypeSelector
                    selectedType={loanType}
                    onSelectType={handleLoanTypeChange}
                />

                {/* Sliders Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{config.name} Details</Text>

                    <RangeSlider
                        label="Required loan amount"
                        value={principal}
                        min={config.minAmount}
                        max={config.maxAmount}
                        step={config.amountStep}
                        formatValue={formatAmount}
                        formatMin={(v) => `Min: ${formatAmount(v)}`}
                        formatMax={(v) => `Max: ${formatAmount(v)}`}
                        onValueChange={handlePrincipalChange}
                    />

                    <RangeSlider
                        label="Interest rate"
                        value={interestRate}
                        min={config.minRate}
                        max={config.maxRate}
                        step={config.rateStep}
                        formatValue={(v) => v.toFixed(1)}
                        formatMin={(v) => `Min: ${v.toFixed(1)}%`}
                        formatMax={(v) => `Max: ${v.toFixed(1)}%`}
                        suffix="%"
                        onValueChange={handleInterestRateChange}
                    />

                    <RangeSlider
                        label="Loan tenure"
                        value={tenure}
                        min={config.minTenure}
                        max={config.maxTenure}
                        step={config.tenureStep}
                        formatValue={(v) => v.toString()}
                        formatMin={(v) => `Min: ${v} years`}
                        formatMax={(v) => `Max: ${v} years`}
                        suffix=" years"
                        onValueChange={handleTenureChange}
                    />
                </View>

                {/* Summary Section */}
                <View style={styles.summarySection}>
                    <LoanSummary
                        interestRate={interestRate}
                        loanAmount={emiResult.principal}
                        interestPayable={emiResult.totalInterest}
                        emi={emiResult.emi}
                    />

                    {/* Total Amount */}
                    <View style={[styles.section, { marginTop: spacing.lg }]}>
                        <View style={styles.totalAmountContainer}>
                            <Text style={styles.totalLabel}>Total Amount Payable</Text>
                            <Text style={styles.totalValue}>
                                ₹ {formatNumber(emiResult.totalPayment)}
                            </Text>
                        </View>
                    </View>


                </View>
            </View>
        </View>
    );
};
