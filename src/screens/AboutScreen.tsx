import React, { memo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Linking,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CalculatorIcon } from '../components/CalculatorIcon';

type AboutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'About'>;

export const AboutScreen: React.FC = memo(() => {
    const navigation = useNavigation<AboutScreenNavigationProp>();
    const { colors, spacing, typography, shadows, isDark } = useTheme();

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

        /* APP INFO */
        appInfoCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
            ...shadows.md,
        },
        appIcon: {
            fontSize: 64,
            marginBottom: 16,
        },
        appName: {
            fontSize: typography.fontSize.xl,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4,
        },
        appVersion: {
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
            marginBottom: 12,
        },
        appDescription: {
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 20,
        },

        /* FEATURES */
        sectionTitle: {
            fontSize: typography.fontSize.sm,
            fontWeight: '600',
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: spacing.sm,
            marginTop: spacing.md,
            marginLeft: spacing.xs,
        },
        section: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderRadius: 16,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
            overflow: 'hidden',
            ...shadows.sm,
        },
        featureRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
        },
        featureRowLast: {
            borderBottomWidth: 0,
        },
        featureIcon: {
            fontSize: 20,
            marginRight: 12,
        },
        featureText: {
            fontSize: typography.fontSize.md,
            color: colors.text,
            flex: 1,
        },
        checkIcon: {
            fontSize: 16,
            color: '#10B981',
        },

        /* LINKS */
        linkRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
        },
        linkRowLast: {
            borderBottomWidth: 0,
        },
        linkIcon: {
            fontSize: 20,
            marginRight: 12,
        },
        linkText: {
            fontSize: typography.fontSize.md,
            color: colors.text,
            flex: 1,
        },
        arrowIcon: {
            fontSize: 16,
            color: colors.textMuted,
        },

        /* FOOTER */
        footer: {
            alignItems: 'center',
            marginTop: spacing.xl,
            paddingHorizontal: spacing.md,
        },
        footerText: {
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 20,
        },
        copyrightText: {
            fontSize: typography.fontSize.xs,
            color: colors.textMuted,
            marginTop: spacing.md,
        },
    });

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleLink = useCallback((url: string) => {
        Linking.openURL(url).catch(() => { });
    }, []);

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
                        <Text style={styles.title}>About</Text>
                        <Text style={styles.subtitle}>App information</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* App Info Card */}
                <View style={styles.appInfoCard}>
                    <View style={{ marginBottom: 16 }}>
                        <Image
                            source={require('../../assets/emi-calc.png')}
                            style={{ width: 80, height: 80 }}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.appName}>AllCalcy</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                    <Text style={styles.appDescription}>
                        Your all-in-one financial calculator app for EMI, SIP, and FD calculations.
                        Plan your finances smartly with accurate results.
                    </Text>
                </View>

                {/* Features */}
                <Text style={styles.sectionTitle}>Features</Text>
                <View style={styles.section}>
                    <View style={styles.featureRow}>
                        <View style={{ marginRight: 12 }}>
                            <CalculatorIcon name="personal" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.featureText}>EMI Calculator</Text>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={{ marginRight: 12 }}>
                            <CalculatorIcon name="sip" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.featureText}>SIP Calculator</Text>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={{ marginRight: 12 }}>
                            <CalculatorIcon name="fd" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.featureText}>FD Calculator</Text>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={{ marginRight: 12 }}>
                            <CalculatorIcon name="moon" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.featureText}>Dark Mode</Text>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                    <View style={[styles.featureRow, styles.featureRowLast]}>
                        <View style={{ marginRight: 12 }}>
                            <CalculatorIcon name="eligibility" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.featureText}>Offline Support</Text>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                </View>

                {/* Legal Links */}
                <Text style={styles.sectionTitle}>Legal</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.linkRow}>
                        <Text style={styles.linkText}>Privacy Policy</Text>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkRow}>
                        <Text style={styles.linkText}>Terms of Service</Text>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.linkRow, styles.linkRowLast]}>
                        <Text style={styles.linkText}>Disclaimer</Text>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        This app provides calculations for informational purposes only.
                        Please consult with financial advisors for actual financial decisions.
                    </Text>
                    <Text style={styles.copyrightText}>
                        © 2026 AllCalcy. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
});
