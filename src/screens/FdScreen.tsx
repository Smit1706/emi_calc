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
import { calculateFD, fdConfig, compoundingOptions, CompoundingType } from '../calculators/fd/fdCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type FdScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Fd'>;

export const FdScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<FdScreenNavigationProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();
    const { formatCurrency, formatNumber, symbol } = useCurrency();

    /* STATE */
    const [principal, setPrincipal] = useState(fdConfig.defaultAmount);
    const [interestRate, setInterestRate] = useState(fdConfig.defaultRate);
    const [years, setYears] = useState(fdConfig.defaultYears);
    const [compoundingIndex, setCompoundingIndex] = useState(1); // Quarterly

    const compounding = compoundingOptions[compoundingIndex];

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
            color: '#3B82F6',
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

        /* COMPOUNDING SELECTOR */
        compoundingContainer: {
            marginBottom: spacing.md,
        },
        compoundingLabel: {
            fontSize: typography.fontSize.md,
            color: isDark ? '#FFFFFF' : colors.text,
            fontWeight: '500',
            marginBottom: spacing.sm,
        },
        compoundingRow: {
            flexDirection: 'row',
            gap: 8,
        },
        compoundingButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
        },
        compoundingButtonActive: {
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
        },
        compoundingButtonText: {
            fontSize: typography.fontSize.sm,
            fontWeight: '500',
            color: colors.textSecondary,
        },
        compoundingButtonTextActive: {
            color: '#FFFFFF',
        },

        calculateButton: {
            backgroundColor: '#3B82F6',
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

    /* FD CALC */
    const fdResult = useMemo(() => {
        return calculateFD({
            principal,
            annualRate: interestRate,
            years,
            compoundingFrequency: compounding.value,
        });
    }, [principal, interestRate, years, compounding.value]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleCalculate = useCallback(() => {
        navigation.navigate('FdResult', {
            principal: fdResult.principal,
            maturityAmount: fdResult.maturityAmount,
            interestEarned: fdResult.interestEarned,
            interestRate,
            tenure: years,
            compoundingFrequency: fdResult.compoundingFrequency,
        });
    }, [navigation, fdResult, interestRate, years]);

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
                                <CalculatorIcon name="fd" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>FD Calculator</Text>
                        </View>
                        <Text style={styles.subtitle}>Calculate fixed deposit maturity</Text>
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
                    <Text style={styles.previewValue}>{formatCurrency(fdResult.maturityAmount)}</Text>
                    <Text style={styles.previewSuffix}>after {years} years</Text>
                </View>

                {/* SLIDERS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Deposit Details</Text>

                    <RangeSlider
                        label="Deposit Amount"
                        value={principal}
                        min={fdConfig.minAmount}
                        max={fdConfig.maxAmount}
                        step={fdConfig.amountStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setPrincipal}
                    />

                    <RangeSlider
                        label="Interest Rate"
                        value={interestRate}
                        min={fdConfig.minRate}
                        max={fdConfig.maxRate}
                        step={fdConfig.rateStep}
                        formatValue={formatRate}
                        suffix="%"
                        onValueChange={setInterestRate}
                    />

                    <RangeSlider
                        label="Time Period"
                        value={years}
                        min={fdConfig.minYears}
                        max={fdConfig.maxYears}
                        step={fdConfig.yearsStep}
                        formatValue={formatYears}
                        suffix="yr"
                        onValueChange={setYears}
                    />

                    {/* COMPOUNDING SELECTOR */}
                    <View style={styles.compoundingContainer}>
                        <Text style={styles.compoundingLabel}>Compounding Frequency</Text>
                        <View style={styles.compoundingRow}>
                            {compoundingOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.compoundingButton,
                                        compoundingIndex === index && styles.compoundingButtonActive,
                                    ]}
                                    onPress={() => setCompoundingIndex(index)}
                                >
                                    <Text
                                        style={[
                                            styles.compoundingButtonText,
                                            compoundingIndex === index && styles.compoundingButtonTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* CALCULATE BUTTON */}
                <TouchableOpacity
                    style={styles.calculateButton}
                    onPress={handleCalculate}
                    activeOpacity={0.8}
                >
                    <Text style={styles.calculateButtonText}>Calculate FD Maturity →</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
