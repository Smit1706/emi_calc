import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { RangeSlider } from '../components/RangeSlider';
import { CalculatorIcon } from '../components/CalculatorIcon';
import { calculateLoanEligibility, loanEligibilityConfig } from '../calculators/loanEligibility/loanEligibilityCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoanEligibilityScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoanEligibility'>;
type LoanEligibilityScreenRouteProp = RouteProp<RootStackParamList, 'LoanEligibility'>;

export const LoanEligibilityScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<LoanEligibilityScreenNavigationProp>();
    const route = useRoute<LoanEligibilityScreenRouteProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();
    const { formatCurrency, formatNumber, symbol } = useCurrency();

    // Check for prefill params from EMI result
    const prefillInterestRate = route.params?.prefillInterestRate;
    const prefillTenure = route.params?.prefillTenure;

    /* STATE - use prefill values if available */
    const [monthlyIncome, setMonthlyIncome] = useState(loanEligibilityConfig.defaultIncome);
    const [existingEMI, setExistingEMI] = useState(loanEligibilityConfig.defaultEMI);
    const [interestRate, setInterestRate] = useState(prefillInterestRate ?? loanEligibilityConfig.defaultRate);
    const [tenure, setTenure] = useState(prefillTenure ?? loanEligibilityConfig.defaultTenure);

    /* STYLES */
    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        /* HEADER - Groww/Zerodha style */
        fixedHeader: {
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            paddingTop: spacing.lg + 16,
            paddingBottom: spacing.md,
            paddingHorizontal: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        backButton: {
            padding: 4,
            marginRight: 12,
        },
        backIcon: {
            fontSize: 22,
            color: isDark ? '#FFFFFF' : '#1A1A1A',
        },
        headerCenter: {
            flex: 1,
        },
        title: {
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
            letterSpacing: 0.2,
        },
        subtitle: {
            marginTop: 2,
            fontSize: 12,
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            fontWeight: '400',
        },
        scrollContent: {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.lg,
        },
        previewContainer: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
            alignItems: 'center',
        },
        previewLabel: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginBottom: 4,
        },
        previewValue: {
            fontSize: typography.fontSize.xxl,
            fontWeight: '700',
            color: '#059669', // Emerald for eligibility
        },
        previewSuffix: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 4,
        },
        previewEMI: {
            fontSize: typography.fontSize.md,
            color: colors.text,
            marginTop: 8,
            fontWeight: '500',
        },
        section: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.surfaceElevated,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderWidth: 2,
            borderColor: isDark ? '#FFFFFF' : '#000000',
            ...shadows.md,
        },
        sectionTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.md,
        },
        infoCard: {
            backgroundColor: isDark ? 'rgba(5,150,105,0.15)' : 'rgba(5,150,105,0.1)',
            borderRadius: borderRadius.md,
            padding: spacing.sm,
            marginBottom: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
        },
        infoIcon: {
            fontSize: 16,
            marginRight: 8,
        },
        infoText: {
            fontSize: typography.fontSize.sm,
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            flex: 1,
        },
        calculateButton: {
            backgroundColor: '#059669', // Emerald for eligibility
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: spacing.sm,
            ...shadows.md,
        },
        calculateButtonText: {
            fontSize: typography.fontSize.lg,
            fontWeight: '700',
            color: '#FFFFFF',
        },
    }), [colors, spacing, borderRadius, typography, shadows, isDark]);

    /* CALCULATION */
    const result = useMemo(() => {
        return calculateLoanEligibility({
            monthlyIncome,
            existingEMI,
            interestRate,
            tenureYears: tenure,
        });
    }, [monthlyIncome, existingEMI, interestRate, tenure]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleCalculate = useCallback(() => {
        // Analytics event would go here
        navigation.navigate('LoanEligibilityResult', {
            monthlyIncome: result.monthlyIncome,
            existingEMI: result.existingEMI,
            availableForEMI: result.availableForEMI,
            maxLoanAmount: result.maxLoanAmount,
            emi: result.emi,
            interestRate: result.interestRate,
            tenure: result.tenure,
            totalPayment: result.totalPayment,
            totalInterest: result.totalInterest,
        });
    }, [navigation, result]);

    const formatAmount = useCallback((v: number) => formatNumber(v), [formatNumber]);

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
            />

            {/* HEADER */}
            <View style={styles.fixedHeader}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginRight: 8 }}>
                                <CalculatorIcon name="eligibility" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>Loan Eligibility</Text>
                        </View>
                        <Text style={styles.subtitle}>Check how much loan you can get</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                {/* LIVE PREVIEW */}
                <View style={styles.previewContainer}>
                    <Text style={styles.previewLabel}>Maximum Eligible Loan</Text>
                    <Text style={styles.previewValue}>{formatCurrency(result.maxLoanAmount)}</Text>
                    <Text style={styles.previewSuffix}>for {tenure} years at {interestRate}%</Text>
                    <Text style={styles.previewEMI}>EMI: {formatCurrency(result.emi)}/month</Text>
                </View>

                {/* INFO CARD */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                    <Text style={styles.infoText}>
                        Banks typically allow up to 50% of your income for loan EMIs
                    </Text>
                </View>

                {/* INCOME SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Income Details</Text>

                    <RangeSlider
                        label="Monthly Income"
                        value={monthlyIncome}
                        min={loanEligibilityConfig.minIncome}
                        max={loanEligibilityConfig.maxIncome}
                        step={loanEligibilityConfig.incomeStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setMonthlyIncome}
                    />

                    <RangeSlider
                        label="Existing EMI (if any)"
                        value={existingEMI}
                        min={loanEligibilityConfig.minEMI}
                        max={Math.min(loanEligibilityConfig.maxEMI, monthlyIncome * 0.5)}
                        step={loanEligibilityConfig.emiStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setExistingEMI}
                    />
                </View>

                {/* LOAN SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loan Details</Text>

                    <RangeSlider
                        label="Interest Rate"
                        value={interestRate}
                        min={loanEligibilityConfig.minRate}
                        max={loanEligibilityConfig.maxRate}
                        step={loanEligibilityConfig.rateStep}
                        formatValue={(v) => v.toFixed(1)}
                        suffix="%"
                        onValueChange={setInterestRate}
                    />

                    <RangeSlider
                        label="Loan Tenure"
                        value={tenure}
                        min={loanEligibilityConfig.minTenure}
                        max={loanEligibilityConfig.maxTenure}
                        step={loanEligibilityConfig.tenureStep}
                        formatValue={(v) => v.toString()}
                        suffix="yr"
                        onValueChange={setTenure}
                    />
                </View>

                {/* CALCULATE BUTTON */}
                <TouchableOpacity
                    style={styles.calculateButton}
                    onPress={handleCalculate}
                    activeOpacity={0.8}
                >
                    <Text style={styles.calculateButtonText}>Check Eligibility →</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
