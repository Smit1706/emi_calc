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
import { calculateSIP, sipConfig } from '../calculators/sip/sipCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type SipScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sip'>;

export const SipScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<SipScreenNavigationProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();
    const { formatCurrency, formatNumber, symbol } = useCurrency();

    /* STATE */
    const [monthlyInvestment, setMonthlyInvestment] = useState(sipConfig.defaultAmount);
    const [annualReturn, setAnnualReturn] = useState(sipConfig.defaultReturn);
    const [years, setYears] = useState(sipConfig.defaultYears);

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
            color: '#10B981',
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
            backgroundColor: '#10B981',
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

    /* SIP CALC */
    const sipResult = useMemo(() => {
        return calculateSIP({
            monthlyInvestment,
            annualReturn,
            years,
        });
    }, [monthlyInvestment, annualReturn, years]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleCalculate = useCallback(() => {
        navigation.navigate('SipResult', {
            monthlyInvestment: sipResult.monthlyInvestment,
            totalInvested: sipResult.totalInvested,
            futureValue: sipResult.futureValue,
            wealthGain: sipResult.wealthGain,
            annualReturn,
            years,
        });
    }, [navigation, sipResult, annualReturn, years]);

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
                                <CalculatorIcon name="sip" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>SIP Calculator</Text>
                        </View>
                        <Text style={styles.subtitle}>Plan your systematic investments</Text>
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
                    <Text style={styles.previewLabel}>Expected Future Value</Text>
                    <Text style={styles.previewValue}>{formatCurrency(sipResult.futureValue)}</Text>
                    <Text style={styles.previewSuffix}>after {years} years</Text>
                </View>

                {/* SLIDERS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Investment Details</Text>

                    <RangeSlider
                        label="Monthly Investment"
                        value={monthlyInvestment}
                        min={sipConfig.minAmount}
                        max={sipConfig.maxAmount}
                        step={sipConfig.amountStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setMonthlyInvestment}
                    />

                    <RangeSlider
                        label="Expected Return Rate"
                        value={annualReturn}
                        min={sipConfig.minReturn}
                        max={sipConfig.maxReturn}
                        step={sipConfig.returnStep}
                        formatValue={(v) => v.toFixed(1)}
                        suffix="%"
                        onValueChange={setAnnualReturn}
                    />

                    <RangeSlider
                        label="Time Period"
                        value={years}
                        min={sipConfig.minYears}
                        max={sipConfig.maxYears}
                        step={sipConfig.yearsStep}
                        formatValue={(v) => v.toString()}
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
                    <Text style={styles.calculateButtonText}>Calculate SIP Returns →</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
