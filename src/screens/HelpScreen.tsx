import React, { memo, useCallback } from 'react';
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
import { RootStackParamList } from '../navigation/AppNavigator';
import { CalculatorIcon } from '../components/CalculatorIcon';

type HelpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Help'>;

export const HelpScreen: React.FC = memo(() => {
    const navigation = useNavigation<HelpScreenNavigationProp>();
    const { colors, spacing, typography, isDark } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
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
            paddingBottom: 40,
        },
        faqSection: {
            marginBottom: spacing.xl,
        },
        faqItem: {
            marginBottom: spacing.lg,
        },
        question: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.xs,
            lineHeight: 22,
        },
        answer: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        disclaimerBox: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            borderRadius: 12,
            padding: spacing.md,
            marginTop: spacing.md,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
        },
        disclaimerTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.text,
            marginBottom: spacing.xs,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        disclaimerText: {
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 18,
        },
    });

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

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
                        <Text style={styles.title}>Help & FAQ</Text>
                        <Text style={styles.subtitle}>Common questions & information</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.faqSection}>
                    <View style={styles.faqItem}>
                        <Text style={styles.question}>How are the calculations performed?</Text>
                        <Text style={styles.answer}>
                            Our app uses standard financial formulas for all calculations.
                            EMI is calculated using the reducing balance method. SIP returns are based on projected annual growth rates compounded monthly. FD and RD calculations use standard compounding interest formulas based on your selected frequency.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>How does the currency display work?</Text>
                        <Text style={styles.answer}>
                            The app allows you to select your preferred currency for display purposes. This handles symbols and number formatting (like commas and decimal places) according to local standards. Note that the app does not perform real-time currency conversion; it simply formats the numbers you provide.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Is my data saved anywhere?</Text>
                        <Text style={styles.answer}>
                            No. All calculations are performed locally on your device. We do not have a backend server, and we do not collect, store, or share any of your financial data or calculation history.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Does the app require an internet connection?</Text>
                        <Text style={styles.answer}>
                            The core calculation features work entirely offline. An internet connection is only needed if you wish to contact support via email or rate the app on the store.
                        </Text>
                    </View>

                    <View style={styles.disclaimerBox}>
                        <Text style={styles.disclaimerTitle}>Planning Tool Only</Text>
                        <Text style={styles.disclaimerText}>
                            The results provided by this application are for informational and planning purposes only. Actual rates and amounts may vary based on your financial institution's specific terms and conditions. Please consult with a qualified financial advisor before making any major financial decisions.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});
