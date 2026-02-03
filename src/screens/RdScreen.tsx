import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { RangeSlider } from '../components/RangeSlider';
import { CalculatorIcon } from '../components/CalculatorIcon';
import { calculateRD, rdConfig } from '../calculators/rd/rdCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type RdScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Rd'>;

export const RdScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<RdScreenNavigationProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();
    const { formatCurrency, formatNumber, symbol } = useCurrency();

    /* STATE */
    const [monthlyDeposit, setMonthlyDeposit] = useState(rdConfig.defaultAmount);
    const [interestRate, setInterestRate] = useState(rdConfig.defaultRate);
    const [years, setYears] = useState(rdConfig.defaultYears);

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
            color: '#8B5CF6',  // Purple for RD
        },
        previewSuffix: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 4,
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
            backgroundColor: '#8B5CF6',  // Purple for RD
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

    /* RD CALC */
    const rdResult = useMemo(() => {
        return calculateRD({
            monthlyDeposit,
            annualRate: interestRate,
            years,
        });
    }, [monthlyDeposit, interestRate, years]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleCalculate = useCallback(() => {
        navigation.navigate('RdResult', {
            monthlyDeposit: rdResult.monthlyDeposit,
            totalDeposits: rdResult.totalDeposits,
            maturityAmount: rdResult.maturityAmount,
            interestEarned: rdResult.interestEarned,
            interestRate,
            tenure: years,
        });
    }, [navigation, rdResult, interestRate, years]);

    const formatAmount = useCallback((v: number) => formatNumber(v), [formatNumber]);
    const formatRate = useCallback((v: number) => v.toFixed(1), []);
    const formatYears = useCallback((v: number) => v.toString(), []);

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
                                <CalculatorIcon name="rd" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>RD Calculator</Text>
                        </View>
                        <Text style={styles.subtitle}>Calculate recurring deposit returns</Text>
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
                    <Text style={styles.previewLabel}>Maturity Amount</Text>
                    <Text style={styles.previewValue}>{formatCurrency(rdResult.maturityAmount)}</Text>
                    <Text style={styles.previewSuffix}>after {years} years</Text>
                </View>

                {/* SLIDERS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>RD Details</Text>

                    <RangeSlider
                        label="Monthly Deposit"
                        value={monthlyDeposit}
                        min={rdConfig.minAmount}
                        max={rdConfig.maxAmount}
                        step={rdConfig.amountStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setMonthlyDeposit}
                    />

                    <RangeSlider
                        label="Interest Rate"
                        value={interestRate}
                        min={rdConfig.minRate}
                        max={rdConfig.maxRate}
                        step={rdConfig.rateStep}
                        formatValue={formatRate}
                        suffix="%"
                        onValueChange={setInterestRate}
                    />

                    <RangeSlider
                        label="Time Period"
                        value={years}
                        min={rdConfig.minYears}
                        max={rdConfig.maxYears}
                        step={rdConfig.yearsStep}
                        formatValue={formatYears}
                        suffix="yr"
                        onValueChange={setYears}
                    />
                </View>

                {/* CALCULATE BUTTON */}
                <TouchableOpacity
                    style={styles.calculateButton}
                    onPress={handleCalculate}
                    activeOpacity={0.8}
                >
                    <Text style={styles.calculateButtonText}>Calculate RD Maturity →</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
