import React, { memo, useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Switch,
    Modal,
    FlatList,
    Linking,
    Platform,
    Alert,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useCurrency, currencies, CurrencyCode } from '../context/CurrencyContext';
import { currencyList } from '../utils/currency';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CalculatorIcon } from '../components/CalculatorIcon';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = memo(() => {
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const { colors, spacing, typography, shadows, isDark, toggleTheme } = useTheme();
    const { currency, currencyConfig, setCurrency } = useCurrency();
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

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
        /* SECTION */
        section: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderRadius: 16,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
            overflow: 'hidden',
            ...shadows.sm,
        },
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
        settingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
        },
        settingRowLast: {
            borderBottomWidth: 0,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        settingIcon: {
            fontSize: 14,
            fontWeight: '600',
            marginRight: 12,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
            minWidth: 32,
            textAlign: 'center',
            color: colors.text,
        },
        settingTextContainer: {
            flex: 1,
        },
        settingLabel: {
            fontSize: typography.fontSize.md,
            fontWeight: '500',
            color: colors.text,
        },
        settingDescription: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        settingValue: {
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
        },
        arrowIcon: {
            fontSize: 16,
            color: colors.textMuted,
            marginLeft: 8,
        },

        /* VERSION INFO */
        versionContainer: {
            alignItems: 'center',
            marginTop: spacing.xl,
            marginBottom: spacing.md,
        },
        versionText: {
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
        },
        appName: {
            fontSize: typography.fontSize.md,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
        },

        /* CURRENCY PICKER MODAL */
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
            maxHeight: '60%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
        },
        modalTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: colors.text,
        },
        modalClose: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: '600',
        },
        currencyItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
        },
        currencyItemSelected: {
            backgroundColor: isDark ? 'rgba(245,197,24,0.1)' : 'rgba(245,197,24,0.1)',
        },
        currencyFlag: {
            fontSize: 14,
            fontWeight: '700',
            marginRight: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            minWidth: 40,
            textAlign: 'center',
            color: colors.text,
        },
        currencyInfo: {
            flex: 1,
        },
        currencyName: {
            fontSize: typography.fontSize.md,
            fontWeight: '500',
            color: colors.text,
        },
        currencyCode: {
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        currencyCheck: {
            fontSize: 18,
            color: colors.primary,
            fontWeight: '700',
        },
    });

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleAbout = useCallback(() => {
        navigation.navigate('About' as any);
    }, [navigation]);

    const handlePrivacyPolicy = useCallback(() => {
        navigation.navigate('PrivacyPolicy' as any);
    }, [navigation]);

    const handleCurrencySelect = useCallback((code: CurrencyCode) => {
        setCurrency(code);
        setShowCurrencyPicker(false);
    }, [setCurrency]);

    const handleHelp = useCallback(() => {
        navigation.navigate('Help');
    }, [navigation]);

    const handleContactSupport = useCallback(() => {
        const email = 'allcalcy@gmail.com';
        const subject = 'Support – AllCalcy App';

        // Using \r\n and proper encoding for maximum compatibility with Gmail
        const bodyLines = [
            'Hi Support Team,',
            '',
            '--- YOUR MESSAGE BELOW ---',
            '',
            '',
            '--------------------------',
            'APP DIAGNOSTICS:',
            `- App Name: AllCalcy – Smart Finance Calculator`,
            `- Platform: ${Platform.OS === 'android' ? 'Android' : 'iOS'}`,
            `- Selected Currency: ${currencyConfig.name} (${currencyConfig.code})`,
            '--------------------------'
        ];

        const body = bodyLines.join('\r\n');
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const url = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(
                    'Contact Support',
                    `Email: ${email}\n\nPlease email us at the address above. We'll be happy to help!`,
                    [{ text: 'OK' }]
                );
            }
        }).catch(() => {
            Alert.alert('Contact Support', `Support Email: ${email}`);
        });
    }, [currencyConfig]);

    const handleRateApp = useCallback(() => {
        const url = Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/finance-calculator/id123456789'
            : 'https://play.google.com/store/apps/details?id=com.finance.calculator';

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Rate App', 'The store link is currently unavailable.');
            }
        });
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
                        <Text style={styles.title}>Settings</Text>
                        <Text style={styles.subtitle}>Customize your app</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* APPEARANCE */}
                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.section}>
                    <View style={[styles.settingRow, styles.settingRowLast]}>
                        <View style={styles.settingLeft}>
                            <View style={{ marginRight: 12 }}>
                                <CalculatorIcon name={isDark ? 'moon' : 'sun'} size={20} color={colors.primary} />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>Dark Mode</Text>
                                <Text style={styles.settingDescription}>
                                    {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#E5E7EB', true: '#F5C518' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* GENERAL */}
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.settingRow, styles.settingRowLast]}
                        onPress={() => setShowCurrencyPicker(true)}
                    >
                        <View style={styles.settingLeft}>
                            <Text style={styles.settingIcon}>{currencyConfig.flag}</Text>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>Currency</Text>
                                <Text style={styles.settingDescription}>
                                    {currencyConfig.name} ({currencyConfig.symbol})
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* ABOUT */}
                {/* SUPPORT */}
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.settingRow} onPress={handleHelp}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>Help & FAQ</Text>
                                <Text style={styles.settingDescription}>Common questions & information</Text>
                            </View>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handleRateApp}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>Rate App</Text>
                                <Text style={styles.settingDescription}>Support us on the Play Store</Text>
                            </View>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handleContactSupport}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>Contact Support</Text>
                                <Text style={styles.settingDescription}>Email us at allcalcy@gmail.com</Text>
                            </View>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handlePrivacyPolicy}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>Privacy Policy</Text>
                                <Text style={styles.settingDescription}>Transparency & Data Security</Text>
                            </View>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingRow, styles.settingRowLast]} onPress={handleAbout}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingLabel}>About</Text>
                                <Text style={styles.settingDescription}>Version 1.0.0 • Legal</Text>
                            </View>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* VERSION */}
                <View style={styles.versionContainer}>
                    <Image
                        source={require('../../assets/emi-calc.png')}
                        style={{ width: 48, height: 48, marginBottom: 12 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.appName}>AllCalcy</Text>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </View>
            </ScrollView>

            {/* CURRENCY PICKER MODAL */}
            <Modal
                visible={showCurrencyPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCurrencyPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCurrencyPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Currency</Text>
                            <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                                <Text style={styles.modalClose}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={currencyList}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.currencyItem,
                                        item.code === currency && styles.currencyItemSelected,
                                    ]}
                                    onPress={() => handleCurrencySelect(item.code)}
                                >
                                    <Text style={styles.currencyFlag}>{item.flag}</Text>
                                    <View style={styles.currencyInfo}>
                                        <Text style={styles.currencyName}>{item.name}</Text>
                                        <Text style={styles.currencyCode}>
                                            {item.code} ({item.symbol})
                                        </Text>
                                    </View>
                                    {item.code === currency && (
                                        <Text style={styles.currencyCheck}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
});
