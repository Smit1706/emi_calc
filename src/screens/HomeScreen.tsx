import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Keyboard,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { RangeSlider } from '../components/RangeSlider';

import { LoanSummary } from '../components/LoanSummary';
import { LoanTypeSelector } from '../components/LoanTypeSelector';
import { ThemeToggle } from '../components/ThemeToggle';
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

    // Header colors matching the reference image
    const headerBgColor = '#1f1f1f';
    const headerTextColor = '#FFFFFF';
    const headerSubtitleColor = 'rgba(255, 255, 255, 0.7)';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerContainer: {
            backgroundColor: headerBgColor,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.lg,
            paddingBottom: spacing.lg,
            marginBottom: spacing.xs,
            ...shadows.lg,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        toggleWrapper: {
            marginTop: spacing.lg,
        },
        title: {
            fontSize: typography.fontSize.xl,
            fontWeight: '700',
            color: headerTextColor,
        },
        subtitle: {
            fontSize: typography.fontSize.sm,
            color: headerSubtitleColor,
            marginTop: spacing.xs,
        },

        content: {
            flex: 1,
            paddingHorizontal: spacing.md,
        },
        section: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.surfaceElevated,
            borderRadius: borderRadius.lg,
            padding: spacing.sm,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: isDark ? '#FFFFFF' : '#000000', // White in dark, black in light
            ...shadows.md,
        },
        sectionTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : colors.text, // White in dark mode
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





    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={headerBgColor}
            />

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>EMI Calculator</Text>
                        <Text style={styles.subtitle}>Calculate your loan EMI instantly</Text>
                    </View>
                    <View style={styles.toggleWrapper}>
                        <ThemeToggle />
                    </View>
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
                        suffix="yr"
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
                        totalAmount={emiResult.totalPayment}
                    />
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
