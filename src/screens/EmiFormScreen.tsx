import React, { useState, useMemo, useCallback, memo } from 'react';
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
import {
    calculateEMI,
    LoanType,
    loanTypes,
} from '../calculators/emi/emiCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type EmiFormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmiForm'>;
type EmiFormScreenRouteProp = RouteProp<RootStackParamList, 'EmiForm'>;

// Icons for each loan type
const loanIcons: Record<LoanType, string> = {
    personal: 'personal',
    home: 'home',
    car: 'car',
    education: 'education',
};

const createStyles = (
    colors: any,
    spacing: any,
    borderRadius: any,
    typography: any,
    shadows: any,
    isDark: boolean
) =>
    StyleSheet.create({
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
        headerIconRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerLoanIcon: {
            fontSize: 20,
            marginRight: 8,
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

        /* CONTENT */
        scrollContent: {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.lg,
        },

        /* EMI PREVIEW */
        previewContainer: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.primary,
        },
        previewLabel: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginBottom: 4,
        },
        previewEmi: {
            fontSize: typography.fontSize.xxl,
            fontWeight: '700',
            color: colors.primary,
        },
        previewSuffix: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 4,
        },

        /* FORM SECTION */
        section: {
            backgroundColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : colors.surfaceElevated,
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

        /* CALCULATE BUTTON */
        calculateButton: {
            backgroundColor: colors.primary,
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: spacing.sm,
            ...shadows.md,
        },
        calculateButtonText: {
            fontSize: typography.fontSize.lg,
            fontWeight: '700',
            color: '#1A1A2E',
        },
    });

export const EmiFormScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<EmiFormScreenNavigationProp>();
    const route = useRoute<EmiFormScreenRouteProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();
    const { formatCurrency, formatNumber, symbol } = useCurrency();

    const loanType = route.params.loanType;
    const config = loanTypes[loanType];
    const icon = loanIcons[loanType];

    /* STATE */
    const [principal, setPrincipal] = useState(config.defaultAmount);
    const [interestRate, setInterestRate] = useState(config.defaultRate);
    const [tenure, setTenure] = useState(config.defaultTenure);

    /* STYLES */
    const styles = useMemo(
        () => createStyles(colors, spacing, borderRadius, typography, shadows, isDark),
        [colors, spacing, borderRadius, typography, shadows, isDark]
    );

    /* HANDLERS */
    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    /* EMI CALC */
    const emiResult = useMemo(() => {
        return calculateEMI({
            principal,
            annualRate: interestRate,
            tenureMonths: tenure * 12,
        });
    }, [principal, interestRate, tenure]);

    const formatAmount = useCallback((v: number) => formatNumber(v), [formatNumber]);
    const formatRate = useCallback((v: number) => v.toFixed(1), []);
    const formatTenure = useCallback((v: number) => v.toString(), []);

    const handleCalculate = useCallback(() => {
        navigation.navigate('EmiResult', {
            emi: emiResult.emi,
            totalPayment: emiResult.totalPayment,
            totalInterest: emiResult.totalInterest,
            principal: emiResult.principal,
            interestRate,
            tenure,
            loanType: config.name,
        });
    }, [navigation, emiResult, interestRate, tenure, config.name]);

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
                        <View style={styles.headerIconRow}>
                            <View style={{ marginRight: 8 }}>
                                <CalculatorIcon name={icon} size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>{config.name}</Text>
                        </View>
                        <Text style={styles.subtitle}>Calculate your EMI instantly</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
            >
                {/* LIVE EMI PREVIEW */}
                <View style={styles.previewContainer}>
                    <Text style={styles.previewLabel}>Estimated Monthly EMI</Text>
                    <Text style={styles.previewEmi}>{formatCurrency(emiResult.emi)}</Text>
                    <Text style={styles.previewSuffix}>per month</Text>
                </View>

                {/* SLIDERS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loan Details</Text>

                    <RangeSlider
                        label="Required loan amount"
                        value={principal}
                        min={config.minAmount}
                        max={config.maxAmount}
                        step={config.amountStep}
                        formatValue={formatAmount}
                        currencySymbol={symbol}
                        onValueChange={setPrincipal}
                    />

                    <RangeSlider
                        label="Interest rate"
                        value={interestRate}
                        min={config.minRate}
                        max={config.maxRate}
                        step={config.rateStep}
                        formatValue={formatRate}
                        suffix="%"
                        onValueChange={setInterestRate}
                    />

                    <RangeSlider
                        label="Loan tenure"
                        value={tenure}
                        min={config.minTenure}

                        max={config.maxTenure}
                        step={config.tenureStep}
                        formatValue={formatTenure}
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
                    <Text style={styles.calculateButtonText}>Calculate EMI →</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
