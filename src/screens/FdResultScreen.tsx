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

type FdResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FdResult'>;
type FdResultScreenRouteProp = RouteProp<RootStackParamList, 'FdResult'>;

export const FdResultScreen: React.FC = memo(() => {
    const navigation = useNavigation<FdResultScreenNavigationProp>();
    const route = useRoute<FdResultScreenRouteProp>();
    const { colors, spacing, typography, shadows, isDark } = useTheme();
    const { formatCurrency } = useCurrency();

    const {
        principal,
        maturityAmount,
        interestEarned,
        interestRate,
        tenure,
        compoundingFrequency,
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

        /* MATURITY HIGHLIGHT */
        valueCard: {
            backgroundColor: '#3B82F6',
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
        summaryValueGreen: {
            color: '#10B981',
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
            backgroundColor: '#3B82F6',
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
                        <Text style={styles.title}>FD Result</Text>
                        <Text style={styles.subtitle}>Your maturity details</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Maturity Highlight */}
                <View style={styles.valueCard}>
                    <Text style={styles.valueLabel}>Maturity Amount</Text>
                    <Text style={styles.valueAmount}>{formatCurrency(maturityAmount)}</Text>
                    <Text style={styles.valueSuffix}>after {tenure} years</Text>
                </View>

                {/* Deposit Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Deposit Summary</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <View style={[styles.summaryDot, { backgroundColor: '#6B7280' }]} />
                            <Text style={styles.summaryLabel}>Principal Amount</Text>
                        </View>
                        <Text style={styles.summaryValue}>{formatCurrency(principal)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <View style={[styles.summaryDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.summaryLabel}>Interest Earned</Text>
                        </View>
                        <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
                            +{formatCurrency(interestEarned)}
                        </Text>
                    </View>

                    <View style={[styles.summaryRow, styles.summaryRowLast]}>
                        <View style={styles.summaryRowLeft}>
                            <View style={[styles.summaryDot, { backgroundColor: '#3B82F6' }]} />
                            <Text style={styles.summaryLabel}>Maturity Amount</Text>
                        </View>
                        <Text style={styles.summaryValue}>{formatCurrency(maturityAmount)}</Text>
                    </View>
                </View>

                {/* Deposit Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Deposit Details</Text>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Interest Rate</Text>
                        <Text style={styles.detailsValue}>{interestRate.toFixed(1)}% p.a.</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Tenure</Text>
                        <Text style={styles.detailsValue}>{tenure} years</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Compounding</Text>
                        <Text style={styles.detailsValue}>{compoundingFrequency}</Text>
                    </View>
                </View>

                {/* CTA Buttons */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleCompareAgain}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Compare Another FD</Text>
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
