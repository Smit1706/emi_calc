import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/emiCalculator';

interface LoanSummaryProps {
    interestRate: number;
    loanAmount: number;
    interestPayable: number;
    emi: number;
    totalAmount: number;
}

export const LoanSummary: React.FC<LoanSummaryProps> = memo(({
    interestRate,
    loanAmount,
    interestPayable,
    emi,
    totalAmount,
}) => {
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: isDark ? '#FFFFFF' : '#000000', // White in dark, black in light
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#1F2937',
            marginBottom: 12,
        },
        rateBadge: {
            backgroundColor: '#3B82F6',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            marginBottom: 16,
            alignSelf: 'flex-start',
        },
        rateBadgeText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '600',
        },
        chartContainer: {
            alignItems: 'center',
            marginBottom: spacing.lg,
        },
        legendContainer: {
            marginTop: spacing.md,
        },
        legendRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
        },
        legendLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        legendDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: spacing.sm,
        },
        legendLabel: {
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
        },
        legendValue: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#1F2937',
        },
        divider: {
            height: 1,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.border,
            marginVertical: spacing.sm,
        },
        emiContainer: {
            alignItems: 'center',
            paddingBottom: 1,
            // borderBottomWidth: 3,
            borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.border,
        },
        emiLabel: {
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
            fontWeight: '500',
            marginBottom: 4,
        },
        emiValue: {
            fontSize: 24,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : '#1F2937',
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Loan Summary</Text>

            <View style={styles.rateBadge}>
                <Text style={styles.rateBadgeText}>Interest Rate {interestRate.toFixed(1)}%</Text>
            </View>

            <View style={styles.legendContainer}>
                <View style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                        <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                        <Text style={styles.legendLabel}>Loan Amount</Text>
                    </View>
                    <Text style={styles.legendValue}>{formatCurrency(loanAmount)}</Text>
                </View>

                <View style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                        <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.legendLabel}>Interest Payable</Text>
                    </View>
                    <Text style={styles.legendValue}>{formatCurrency(interestPayable)}</Text>
                </View>

                <View style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                        <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                        <Text style={styles.legendLabel}>Total Amount</Text>
                    </View>
                    <Text style={styles.legendValue}>{formatCurrency(totalAmount)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.emiContainer}>
                    <Text style={styles.emiLabel}>EMI (Monthly Payment)</Text>
                    <Text style={styles.emiValue}>{formatCurrency(emi)}</Text>
                </View>
            </View>
        </View>
    );
});
