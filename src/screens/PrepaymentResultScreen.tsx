import React, { memo, useCallback } from 'react';
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
import { RootStackParamList } from '../navigation/AppNavigator';

type PrepaymentResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PrepaymentResult'>;
type PrepaymentResultScreenRouteProp = RouteProp<RootStackParamList, 'PrepaymentResult'>;

export const PrepaymentResultScreen: React.FC = memo(() => {
    const navigation = useNavigation<PrepaymentResultScreenNavigationProp>();
    const route = useRoute<PrepaymentResultScreenRouteProp>();
    const { colors, spacing, typography, shadows, isDark } = useTheme();
    const { formatCurrency } = useCurrency();

    const {
        originalLoanAmount,
        originalTenure,
        originalEMI,
        originalTotalPayment,
        originalTotalInterest,
        prepaymentAmount,
        prepaymentYear,
        newTenureMonths,
        newTotalPayment,
        newTotalInterest,
        interestSaved,
        tenureReduced,
        interestRate,
    } = route.params;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        /* HEADER - Groww/Zerodha style */
        header: {
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
            padding: spacing.md,
            paddingBottom: 100,
        },

        /* SAVINGS HIGHLIGHT */
        valueCard: {
            backgroundColor: '#DC2626', // Red theme
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            marginBottom: spacing.lg,
            ...shadows.lg,
        },
        valueLabel: {
            fontSize: typography.fontSize.md,
            color: '#FFFFFF',
            opacity: 0.9,
            marginBottom: 8,
        },
        valueAmount: {
            fontSize: 40,
            fontWeight: '800',
            color: '#FFFFFF',
        },
        valueSuffix: {
            fontSize: typography.fontSize.md,
            color: '#FFFFFF',
            opacity: 0.9,
            marginTop: 4,
        },
        tenureRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
        },
        tenureLabel: {
            fontSize: typography.fontSize.sm,
            color: '#FFFFFF',
            marginRight: 8,
        },
        tenureValue: {
            fontSize: typography.fontSize.md,
            fontWeight: '700',
            color: '#FFFFFF',
        },

        /* COMPARISON CARD */
        comparisonCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderRadius: 16,
            padding: 20,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
            ...shadows.md,
        },
        comparisonTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.md,
        },
        comparisonHeader: {
            flexDirection: 'row',
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
        },
        comparisonHeaderLabel: {
            flex: 1,
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
            fontWeight: '500',
        },
        comparisonHeaderValue: {
            flex: 1,
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
            fontWeight: '500',
            textAlign: 'center',
        },
        comparisonRow: {
            flexDirection: 'row',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
        },
        comparisonRowLast: {
            borderBottomWidth: 0,
        },
        comparisonLabel: {
            flex: 1,
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
        },
        comparisonBefore: {
            flex: 1,
            fontSize: typography.fontSize.sm,
            fontWeight: '500',
            color: colors.text,
            textAlign: 'center',
        },
        comparisonAfter: {
            flex: 1,
            fontSize: typography.fontSize.sm,
            fontWeight: '600',
            color: '#10B981',
            textAlign: 'center',
        },

        /* DETAILS CARD */
        detailsCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            borderRadius: 16,
            padding: 16,
            marginBottom: spacing.lg,
        },
        detailsTitle: {
            fontSize: typography.fontSize.md,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 12,
        },
        detailsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 8,
        },
        detailsLabel: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
        },
        detailsValue: {
            fontSize: typography.fontSize.sm,
            fontWeight: '500',
            color: colors.text,
        },

        /* CTA BUTTONS */
        ctaContainer: {
            gap: 12,
        },
        primaryButton: {
            backgroundColor: '#DC2626',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            ...shadows.md,
        },
        primaryButtonText: {
            fontSize: typography.fontSize.lg,
            fontWeight: '700',
            color: '#FFFFFF',
        },
        secondaryButton: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
        },
        secondaryButtonText: {
            fontSize: typography.fontSize.md,
            fontWeight: '600',
            color: colors.text,
        },

        adPlaceholder: {
            height: 60,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
            borderRadius: 0,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacing.lg,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
            borderStyle: 'dashed',
        },
        adPlaceholderText: {
            fontSize: 12,
            color: colors.textMuted,
        },
    });

    const handleCompareAgain = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleGoHome = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    // Format tenure for display
    const formatTenureMonths = (months: number) => {
        const years = Math.floor(months / 12);
        const remainingMonths = Math.round(months % 12);
        if (years === 0) return `${remainingMonths} months`;
        if (remainingMonths === 0) return `${years} years`;
        return `${years}y ${remainingMonths}m`;
    };

    const originalTenureMonths = originalTenure * 12;
    const newTotalTenure = originalTenureMonths - tenureReduced;

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
            />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.title}>Prepayment Result</Text>
                        <Text style={styles.subtitle}>Your savings breakdown</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Savings Highlight */}
                <View style={styles.valueCard}>
                    <Text style={styles.valueLabel}>You'll Save</Text>
                    <Text style={styles.valueAmount}>{formatCurrency(interestSaved)}</Text>
                    <Text style={styles.valueSuffix}>in interest charges</Text>
                    {tenureReduced > 0 && (
                        <View style={styles.tenureRow}>
                            <Text style={styles.tenureLabel}>Tenure Reduced:</Text>
                            <Text style={styles.tenureValue}>
                                {Math.floor(tenureReduced / 12)} years {tenureReduced % 12} months
                            </Text>
                        </View>
                    )}
                </View>

                {/* Before vs After Comparison */}
                <View style={styles.comparisonCard}>
                    <Text style={styles.comparisonTitle}>Before vs After Prepayment</Text>

                    <View style={styles.comparisonHeader}>
                        <Text style={styles.comparisonHeaderLabel}></Text>
                        <Text style={styles.comparisonHeaderValue}>Before</Text>
                        <Text style={styles.comparisonHeaderValue}>After</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>Total Interest</Text>
                        <Text style={styles.comparisonBefore}>{formatCurrency(originalTotalInterest)}</Text>
                        <Text style={styles.comparisonAfter}>{formatCurrency(newTotalInterest)}</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>Total Payment</Text>
                        <Text style={styles.comparisonBefore}>{formatCurrency(originalTotalPayment)}</Text>
                        <Text style={styles.comparisonAfter}>{formatCurrency(newTotalPayment)}</Text>
                    </View>

                    <View style={[styles.comparisonRow, styles.comparisonRowLast]}>
                        <Text style={styles.comparisonLabel}>Loan Tenure</Text>
                        <Text style={styles.comparisonBefore}>{originalTenure} years</Text>
                        <Text style={styles.comparisonAfter}>{formatTenureMonths(newTotalTenure)}</Text>
                    </View>
                </View>

                {/* Prepayment Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Prepayment Details</Text>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Loan Amount</Text>
                        <Text style={styles.detailsValue}>{formatCurrency(originalLoanAmount)}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Interest Rate</Text>
                        <Text style={styles.detailsValue}>{interestRate}% p.a.</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Monthly EMI</Text>
                        <Text style={styles.detailsValue}>{formatCurrency(originalEMI)}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Prepayment Amount</Text>
                        <Text style={styles.detailsValue}>{formatCurrency(prepaymentAmount)}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Prepayment Year</Text>
                        <Text style={styles.detailsValue}>Year {prepaymentYear}</Text>
                    </View>
                </View>

                {/* CTA Buttons */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleCompareAgain}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Compare Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleGoHome}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.adPlaceholder}>
                    <Text style={styles.adPlaceholderText}>Ad Banner Placeholder</Text>
                </View>
            </ScrollView>
        </View>
    );
});
