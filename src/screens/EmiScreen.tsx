import React, { useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../context/ThemeContext';
import { LoanTypeCard } from '../components/LoanTypeCard';
import { LoanType } from '../calculators/emi/emiCalculator';
import { RootStackParamList } from '../navigation/AppNavigator';

type EmiScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmiForm'>;

// Loan type card data
const loanTypeCards = [
    { type: 'personal' as LoanType, icon: 'personal', label: 'Personal Loan', description: 'For personal needs' },
    { type: 'home' as LoanType, icon: 'home', label: 'Home Loan', description: 'For property purchase' },
    { type: 'car' as LoanType, icon: 'car', label: 'Car Loan', description: 'For vehicle purchase' },
    { type: 'education' as LoanType, icon: 'education', label: 'Education Loan', description: 'For studies abroad' },
];

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
            paddingTop: spacing.lg,
            paddingBottom: spacing.lg,
        },

        /* LOAN TYPE SELECTION */
        loanTypeSection: {
            marginBottom: spacing.md,
        },
        loanTypeSectionTitle: {
            fontSize: typography.fontSize.xl,
            fontWeight: '700',
            color: colors.text,
            marginBottom: spacing.xs,
            textAlign: 'center',
        },
        loanTypeSectionSubtitle: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginBottom: spacing.lg,
            textAlign: 'center',
        },
        loanTypeGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },

        /* INFO BOX */
        infoBox: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F9FF',
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginTop: spacing.md,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#BAE6FD',
        },
        infoIcon: {
            fontSize: 20,
            marginBottom: spacing.xs,
        },
        infoText: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            lineHeight: 20,
        },
    });

export const EmiScreen: React.FC = React.memo(() => {
    const navigation = useNavigation<EmiScreenNavigationProp>();
    const { colors, spacing, borderRadius, typography, shadows, isDark } = useTheme();

    /* STYLES */
    const styles = useMemo(
        () => createStyles(colors, spacing, borderRadius, typography, shadows, isDark),
        [colors, spacing, borderRadius, typography, shadows, isDark]
    );

    /* HANDLERS */
    const handleLoanTypeSelect = useCallback((type: LoanType) => {
        navigation.navigate('EmiForm', { loanType: type });
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

            {/* HEADER */}
            <View style={styles.fixedHeader}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.title}>EMI Calculator</Text>
                        <Text style={styles.subtitle}>Calculate your loan EMI instantly</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* LOAN TYPE SELECTION */}
                <View style={styles.loanTypeSection}>
                    <Text style={styles.loanTypeSectionTitle}>Choose Loan Type</Text>
                    <Text style={styles.loanTypeSectionSubtitle}>
                        Tap on a loan type to calculate EMI
                    </Text>
                    <View style={styles.loanTypeGrid}>
                        {loanTypeCards.map((card) => (
                            <LoanTypeCard
                                key={card.type}
                                icon={card.icon}
                                label={card.label}
                                description={card.description}
                                isSelected={false}
                                onPress={() => handleLoanTypeSelect(card.type)}
                            />
                        ))}
                    </View>
                </View>

                {/* INFO BOX */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoIcon}>💡</Text>
                    <Text style={styles.infoText}>
                        EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay your loan.
                        Select a loan type above to calculate your EMI based on loan amount, interest rate, and tenure.
                    </Text>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
});
