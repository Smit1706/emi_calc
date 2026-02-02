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

type EmiResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmiResult'>;
type EmiResultScreenRouteProp = RouteProp<RootStackParamList, 'EmiResult'>;

export const EmiResultScreen: React.FC = memo(() => {
    const navigation = useNavigation<EmiResultScreenNavigationProp>();
    const route = useRoute<EmiResultScreenRouteProp>();
    const { colors, spacing, typography, shadows, isDark } = useTheme();
    const { formatCurrency, symbol } = useCurrency();

    const {
        emi,
        totalPayment,
        totalInterest,
        principal,
        interestRate,
        tenure,
        loanType,
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

        /* EMI HIGHLIGHT CARD */
        emiCard: {
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            marginBottom: spacing.lg,
            ...shadows.lg,
        },
        emiLabel: {
            fontSize: typography.fontSize.md,
            color: '#1A1A2E',
            opacity: 0.7,
            marginBottom: 8,
        },
        emiValue: {
            fontSize: 40,
            fontWeight: '800',
            color: '#1A1A2E',
        },
        emiSuffix: {
            fontSize: typography.fontSize.md,
            color: '#1A1A2E',
            opacity: 0.7,
            marginTop: 4,
        },

        /* SUMMARY CARD */
        summaryCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderRadius: 16,
            padding: 20,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
            ...shadows.md,
        },
        summaryTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.md,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
        },
        summaryRowLast: {
            borderBottomWidth: 0,
        },
        summaryRowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        summaryDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: 12,
        },
        summaryLabel: {
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
        },
        summaryValue: {
            fontSize: typography.fontSize.md,
            fontWeight: '600',
            color: colors.text,
        },

        /* LOAN DETAILS CARD */
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
            backgroundColor: colors.primary,
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            ...shadows.md,
        },
        primaryButtonText: {
            fontSize: typography.fontSize.lg,
            fontWeight: '700',
            color: '#1A1A2E',
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

        /* ACTION BUTTONS - Decision Hub */
        actionSection: {
            marginBottom: spacing.md,
        },
        actionSectionTitle: {
            fontSize: typography.fontSize.md,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.sm,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1.5,
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
            ...shadows.sm,
        },
        actionIcon: {
            fontSize: 22,
            marginRight: 14,
        },
        actionContent: {
            flex: 1,
        },
        actionTitle: {
            fontSize: typography.fontSize.md,
            fontWeight: '600',
            color: colors.text,
        },
        actionDescription: {
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
            marginTop: 2,
        },
        actionArrow: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: '600',
        },

        /* AD PLACEHOLDER */
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
        navigation.navigate('Home');
    }, [navigation]);

    const handleGoHome = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    // Navigate to Loan Eligibility with prefilled data
    const handleCheckEligibility = useCallback(() => {
        console.log('Analytics: emi_to_eligibility_clicked', {
            loanType,
            loanAmount: principal,
            interestRate,
            tenure,
        });
        navigation.navigate('LoanEligibility', {
            prefillInterestRate: interestRate,
            prefillTenure: tenure,
        });
    }, [navigation, loanType, principal, interestRate, tenure]);

    // Navigate to Prepayment with prefilled data
    const handleSeePrepayment = useCallback(() => {
        console.log('Analytics: emi_to_prepayment_clicked', {
            loanType,
            loanAmount: principal,
            interestRate,
            tenure,
        });
        navigation.navigate('Prepayment', {
            prefillLoanAmount: principal,
            prefillInterestRate: interestRate,
            prefillTenure: tenure,
        });
    }, [navigation, loanType, principal, interestRate, tenure]);

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
            />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.title}>EMI Result</Text>
                        <Text style={styles.subtitle}>{loanType}</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* EMI Highlight */}
                <View style={styles.emiCard}>
                    <Text style={styles.emiLabel}>Your Monthly EMI</Text>
                    <Text style={styles.emiValue}>{formatCurrency(emi)}</Text>
                    <Text style={styles.emiSuffix}>per month for {tenure} years</Text>
                </View>

                {/* Loan Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Loan Summary</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <View style={[styles.summaryDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.summaryLabel}>Principal Amount</Text>
                        </View>
                        <Text style={styles.summaryValue}>{formatCurrency(principal)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <View style={[styles.summaryDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.summaryLabel}>Total Interest</Text>
                        </View>
                        <Text style={styles.summaryValue}>{formatCurrency(totalInterest)}</Text>
                    </View>

                    <View style={[styles.summaryRow, styles.summaryRowLast]}>
                        <View style={styles.summaryRowLeft}>
                            <View style={[styles.summaryDot, { backgroundColor: '#3B82F6' }]} />
                            <Text style={styles.summaryLabel}>Total Payment</Text>
                        </View>
                        <Text style={styles.summaryValue}>{formatCurrency(totalPayment)}</Text>
                    </View>
                </View>

                {/* Loan Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Loan Details</Text>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Loan Type</Text>
                        <Text style={styles.detailsValue}>{loanType}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Interest Rate</Text>
                        <Text style={styles.detailsValue}>{interestRate.toFixed(1)}% p.a.</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Tenure</Text>
                        <Text style={styles.detailsValue}>{tenure} years ({tenure * 12} months)</Text>
                    </View>
                </View>

                {/* DECISION HUB - Next Steps */}
                <View style={styles.actionSection}>
                    <Text style={styles.actionSectionTitle}>📌 What's Next?</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleCheckEligibility}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.actionIcon}>✅</Text>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Check Loan Eligibility</Text>
                            <Text style={styles.actionDescription}>See how much loan you can get</Text>
                        </View>
                        <Text style={styles.actionArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSeePrepayment}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.actionIcon}>💸</Text>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>See Prepayment Savings</Text>
                            <Text style={styles.actionDescription}>Calculate interest you can save</Text>
                        </View>
                        <Text style={styles.actionArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* CTA Buttons */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleCompareAgain}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Compare Another Loan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleGoHome}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>

                {/* Ad Placeholder */}
                <View style={styles.adPlaceholder}>
                    <Text style={styles.adPlaceholderText}>Ad Banner Placeholder</Text>
                </View>
            </ScrollView>
        </View>
    );
});
