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
import { calculatePrepayment, prepaymentConfig } from '../calculators/prepayment/prepaymentCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type PrepaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Prepayment'>;
type PrepaymentScreenRouteProp = RouteProp<RootStackParamList, 'Prepayment'>;

export const PrepaymentScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<PrepaymentScreenNavigationProp>();
    const route = useRoute<PrepaymentScreenRouteProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();
    const { formatCurrency, formatNumber, symbol } = useCurrency();

    // Check for prefill params from EMI result
    const prefillLoanAmount = route.params?.prefillLoanAmount;
    const prefillInterestRate = route.params?.prefillInterestRate;
    const prefillTenure = route.params?.prefillTenure;

    /* STATE - use prefill values if available */
    const [loanAmount, setLoanAmount] = useState(prefillLoanAmount ?? prepaymentConfig.defaultLoan);
    const [interestRate, setInterestRate] = useState(prefillInterestRate ?? prepaymentConfig.defaultRate);
    const [tenure, setTenure] = useState(prefillTenure ?? prepaymentConfig.defaultTenure);
    const [prepaymentAmount, setPrepaymentAmount] = useState(prepaymentConfig.defaultPrepayment);
    const [prepaymentYear, setPrepaymentYear] = useState(prepaymentConfig.defaultYear);

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
            color: '#DC2626', // Red for savings
        },
        previewSuffix: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 4,
        },
        previewTenure: {
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
        calculateButton: {
            backgroundColor: '#DC2626', // Red theme for prepayment
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
        return calculatePrepayment({
            loanAmount,
            interestRate,
            tenureYears: tenure,
            prepaymentAmount,
            prepaymentYear,
        });
    }, [loanAmount, interestRate, tenure, prepaymentAmount, prepaymentYear]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleCalculate = useCallback(() => {
        // Analytics event would go here
        navigation.navigate('PrepaymentResult', {
            originalLoanAmount: result.originalLoanAmount,
            originalTenure: result.originalTenure,
            originalEMI: result.originalEMI,
            originalTotalPayment: result.originalTotalPayment,
            originalTotalInterest: result.originalTotalInterest,
            prepaymentAmount: result.prepaymentAmount,
            prepaymentYear: result.prepaymentYear,
            newTenureMonths: result.newTenureMonths,
            newTotalPayment: result.newTotalPayment,
            newTotalInterest: result.newTotalInterest,
            interestSaved: result.interestSaved,
            tenureReduced: result.tenureReduced,
            interestRate: result.interestRate,
        });
    }, [navigation, result]);

    const formatAmount = useCallback((v: number) => formatNumber(v), [formatNumber]);
    const formatRate = useCallback((v: number) => v.toFixed(1), []);
    const formatTenure = useCallback((v: number) => v.toString(), []);
    const formatYear = useCallback((v: number) => `Year ${v}`, []);

    // Dynamic max prepayment year based on tenure
    const maxPrepaymentYear = Math.min(prepaymentConfig.maxYear, tenure);

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
                                <CalculatorIcon name="prepayment" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>Prepayment Calculator</Text>
                        </View>
                        <Text style={styles.subtitle}>Calculate interest savings</Text>
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
                    <Text style={styles.previewLabel}>Interest You'll Save</Text>
                    <Text style={styles.previewValue}>{formatCurrency(result.interestSaved)}</Text>
                    <Text style={styles.previewSuffix}>
                        by prepaying {formatCurrency(prepaymentAmount)} in year {prepaymentYear}
                    </Text>
                    {result.tenureReduced > 0 && (
                        <Text style={styles.previewTenure}>
                            Tenure reduced by {Math.floor(result.tenureReduced / 12)} years {result.tenureReduced % 12} months
                        </Text>
                    )}
                </View>

                {/* LOAN DETAILS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loan Details</Text>

                    <RangeSlider
                        label="Loan Amount"
                        value={loanAmount}
                        min={prepaymentConfig.minLoan}
                        max={prepaymentConfig.maxLoan}
                        step={prepaymentConfig.loanStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setLoanAmount}
                    />

                    <RangeSlider
                        label="Interest Rate"
                        value={interestRate}
                        min={prepaymentConfig.minRate}
                        max={prepaymentConfig.maxRate}
                        step={prepaymentConfig.rateStep}
                        formatValue={formatRate}
                        suffix="%"
                        onValueChange={setInterestRate}
                    />

                    <RangeSlider
                        label="Loan Tenure"
                        value={tenure}
                        min={prepaymentConfig.minTenure}
                        max={prepaymentConfig.maxTenure}
                        step={prepaymentConfig.tenureStep}
                        formatValue={formatTenure}
                        suffix="yr"
                        onValueChange={setTenure}
                    />
                </View>

                {/* PREPAYMENT SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prepayment Details</Text>

                    <RangeSlider
                        label="Prepayment Amount"
                        value={prepaymentAmount}
                        min={prepaymentConfig.minPrepayment}
                        max={Math.min(prepaymentConfig.maxPrepayment, loanAmount)}
                        step={prepaymentConfig.prepaymentStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setPrepaymentAmount}
                    />

                    <RangeSlider
                        label="Prepayment Year"
                        value={prepaymentYear}
                        min={prepaymentConfig.minYear}
                        max={maxPrepaymentYear}
                        step={1}
                        formatValue={formatYear}
                        suffix=""
                        onValueChange={setPrepaymentYear}
                    />
                </View>

                {/* CALCULATE BUTTON */}
                <TouchableOpacity
                    style={styles.calculateButton}
                    onPress={handleCalculate}
                    activeOpacity={0.8}
                >
                    <Text style={styles.calculateButtonText}>Calculate Savings →</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
