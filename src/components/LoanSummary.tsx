import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/emiCalculator';

interface LoanSummaryProps {
    interestRate: number;
    loanAmount: number;
    interestPayable: number;
    emi: number;
}

export const LoanSummary: React.FC<LoanSummaryProps> = memo(({
    interestRate,
    loanAmount,
    interestPayable,
    emi,
}) => {
    const { colors, spacing, borderRadius, typography, shadows } = useTheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
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
            color: '#6B7280',
        },
        legendValue: {
            fontSize: 14,
            fontWeight: '600',
            color: '#1F2937',
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: spacing.sm,
        },
        emiContainer: {
            marginBottom: 16,
            alignItems: 'center',
        },
        emiLabel: {
            fontSize: 14,
            color: '#6B7280',
            fontWeight: '500',
            marginBottom: 4,
        },
        emiValue: {
            fontSize: 24,
            fontWeight: '700',
            color: '#1F2937',
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
                        <View style={[styles.legendDot, { backgroundColor: colors.chartPrincipal }]} />
                        <Text style={styles.legendLabel}>Loan Amount</Text>
                    </View>
                    <Text style={styles.legendValue}>{formatCurrency(loanAmount)}</Text>
                </View>

                <View style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                        <View style={[styles.legendDot, { backgroundColor: colors.chartInterest }]} />
                        <Text style={styles.legendLabel}>Interest Payable</Text>
                    </View>
                    <Text style={styles.legendValue}>{formatCurrency(interestPayable)}</Text>
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
