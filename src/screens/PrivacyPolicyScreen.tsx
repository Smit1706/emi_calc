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
import { useTheme } from '../context/ThemeContext';

export const PrivacyPolicyScreen: React.FC = memo(() => {
    const navigation = useNavigation();
    const { colors, spacing, typography, isDark } = useTheme();

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

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
        title: {
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
        },
        scrollContent: {
            padding: spacing.lg,
            paddingBottom: 40,
        },
        lastUpdated: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 24,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 12,
        },
        paragraph: {
            fontSize: 15,
            lineHeight: 22,
            color: colors.textSecondary,
            marginBottom: 12,
        },
        list: {
            marginLeft: 8,
        },
        listItem: {
            fontSize: 15,
            lineHeight: 22,
            color: colors.textSecondary,
            marginBottom: 8,
        },
    });

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
                    <Text style={styles.title}>Privacy Policy</Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.lastUpdated}>Last Updated: February 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Introduction</Text>
                    <Text style={styles.paragraph}>
                        AllCalcy – Smart Finance Calculator is built as a tool to help you calculate EMIs, investment returns, and loan eligibility. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our App.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Collection and Use</Text>
                    <Text style={styles.paragraph}>
                        Our App is designed to prioritize your privacy. We do not collect any personally identifiable information (PII) directly from you.
                    </Text>
                    <View style={styles.list}>
                        <Text style={styles.listItem}>• No Account Creation: You do not need an account to use the App.</Text>
                        <Text style={styles.listItem}>• Local Processing: All financial calculations and inputs are processed locally on your device. We do not transmit your financial figures or results to any servers.</Text>
                        <Text style={styles.listItem}>• Offline First: Most features of the App work entirely offline, ensuring your data never leaves your device.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Third-Party Services</Text>
                    <Text style={styles.paragraph}>
                        The App may use third-party Service Providers to monitor and analyze the use of our App or to show advertisements. These services may collect anonymous information such as your device ID, device model, and usage patterns to improve performance or serve relevant ads.
                    </Text>
                    <Text style={styles.paragraph}>
                        These third-party providers have their own privacy policies addressing how they use such information. We use:
                    </Text>
                    <View style={styles.list}>
                        <Text style={styles.listItem}>• Analytics: To understand how the app is used and to fix technical issues.</Text>
                        <Text style={styles.listItem}>• Advertisements: To support the continued development of this free tool.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Support</Text>
                    <Text style={styles.paragraph}>
                        When you contact us for support via email, we use the user's default email application. We do not have access to your email account or messages until you deliberately send an email to us. Any information you provide in such an email is used solely to assist with your inquiry.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Children's Privacy</Text>
                    <Text style={styles.paragraph}>
                        Our App is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Security</Text>
                    <Text style={styles.paragraph}>
                        The security of your data is important to us. Since all calculation data remains on your device, its security depends on your device's security features. We encourage users to keep their device software updated and use standard security protections.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
                    <Text style={styles.paragraph}>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
                    </Text>
                    <Text style={[styles.paragraph, { fontWeight: '600', color: colors.primary }]}>
                        allcalcy@gmail.com
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
});
