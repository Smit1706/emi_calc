import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LoanType } from '../calculators/emi/emiCalculator';
import { CalculatorIcon } from '../components/CalculatorIcon';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface CalculatorCardProps {
  title: string;
  icon: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

const CalculatorCard: React.FC<CalculatorCardProps> = memo(({
  title,
  icon,
  description,
  isActive,
  onPress,
  colors,
  isDark,
}) => {
  const cardStyles = StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      padding: 16,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
      borderWidth: 2,
      borderColor: isActive
        ? colors.primary
        : isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: isActive
        ? colors.primary + '20'
        : isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      fontSize: 24,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    badge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: isActive ? colors.primary : colors.textMuted,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: isActive ? '#1A1A2E' : '#FFFFFF',
    },
  });

  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={onPress}
      activeOpacity={isActive ? 0.7 : 1}
      disabled={!isActive}
    >
      <View style={cardStyles.badge}>
        <Text style={cardStyles.badgeText}>
          {isActive ? 'TAP' : 'SOON'}
        </Text>
      </View>
      <View style={cardStyles.iconContainer}>
        {icon.length > 2 ? (
          <CalculatorIcon name={icon} size={28} color={isActive ? colors.primary : colors.textMuted} />
        ) : (
          <Text style={cardStyles.icon}>{icon}</Text>
        )}
      </View>
      <Text style={cardStyles.title}>{title}</Text>
      <Text style={cardStyles.description}>{description}</Text>
    </TouchableOpacity>
  );
});

export const HomeScreen: React.FC = memo(() => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, spacing, typography, shadows, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Modern Flat Header - Groww/Zerodha style
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    iconButton: {
      padding: 4,
    },
    iconText: {
      fontSize: 22,
    },
    scrollContent: {
      padding: spacing.md,
      paddingBottom: 100,
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.md,
      marginTop: spacing.sm,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
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

  // Navigation for simple screens
  const handleNavigate = useCallback((screen: 'Sip' | 'Fd' | 'Rd' | 'LoanEligibility' | 'Prepayment' | 'Settings' | 'About') => {
    navigation.navigate(screen as any);
  }, [navigation]);

  // Navigation for EMI calculators with loan type
  const handleEmiNavigate = useCallback((loanType: LoanType) => {
    navigation.navigate('EmiForm', { loanType });
  }, [navigation]);

  // Loan Calculators - 4 individual loan types
  const loanCalculators = [
    {
      title: 'Personal Loan',
      icon: 'personal',
      description: 'For personal needs',
      loanType: 'personal' as LoanType,
    },
    {
      title: 'Home Loan',
      icon: 'home',
      description: 'For property purchase',
      loanType: 'home' as LoanType,
    },
    {
      title: 'Car Loan',
      icon: 'car',
      description: 'For vehicle purchase',
      loanType: 'car' as LoanType,
    },
    {
      title: 'Education Loan',
      icon: 'education',
      description: 'For studies & courses',
      loanType: 'education' as LoanType,
    },
  ];

  // Investment Calculators
  const investmentCalculators = [
    {
      title: 'SIP',
      icon: 'sip',
      description: 'Mutual fund SIP',
      isActive: true,
      screen: 'Sip' as const,
    },
    {
      title: 'FD',
      icon: 'fd',
      description: 'Fixed deposit',
      isActive: true,
      screen: 'Fd' as const,
    },
    {
      title: 'RD',
      icon: 'rd',
      description: 'Recurring deposit',
      isActive: true,
      screen: 'Rd' as const,
    },
  ];

  // Loan Tools
  const loanTools = [
    {
      title: 'Loan Eligibility',
      icon: 'eligibility',
      description: 'Check your limit',
      isActive: true,
      screen: 'LoanEligibility' as const,
    },
    {
      title: 'Prepayment',
      icon: 'prepayment',
      description: 'Save on interest',
      isActive: true,
      screen: 'Prepayment' as const,
    },
  ];

  // Compact tool item styles
  const toolItemStyles = StyleSheet.create({
    toolRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: spacing.sm,
    },
    toolItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 14,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
      borderWidth: 1.5,
      borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
      ...shadows.sm,
    },
    toolIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    toolContent: {
      flex: 1,
    },
    toolTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    toolDescription: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    toolArrow: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/emi-calc.png')}
                style={{ width: 32, height: 32, marginRight: 10 }}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.title}>AllCalcy</Text>
                <Text style={styles.subtitle}>Smart Finance Calculator</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleNavigate('Settings')}
            >
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* LOAN CALCULATORS - Individual loan types */}
        <Text style={styles.sectionTitle}>📋 Loan EMI Calculators</Text>
        <View style={styles.cardGrid}>
          {loanCalculators.map((calc) => (
            <CalculatorCard
              key={calc.title}
              title={calc.title}
              icon={calc.icon}
              description={calc.description}
              isActive={true}
              onPress={() => handleEmiNavigate(calc.loanType)}
              colors={colors}
              isDark={isDark}
            />
          ))}
        </View>

        {/* INVESTMENT CALCULATORS - Compact Row */}
        <Text style={styles.sectionTitle}>📊 Investment Calculators</Text>
        <View style={toolItemStyles.toolRow}>
          {investmentCalculators.map((calc) => (
            <TouchableOpacity
              key={calc.title}
              style={toolItemStyles.toolItem}
              onPress={() => calc.isActive && handleNavigate(calc.screen)}
              activeOpacity={0.7}
            >
              <View style={toolItemStyles.toolIcon}>
                <CalculatorIcon name={calc.icon} size={20} color={colors.primary} />
              </View>
              <View style={toolItemStyles.toolContent}>
                <Text style={toolItemStyles.toolTitle}>{calc.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* LOAN TOOLS - Compact List */}
        <Text style={styles.sectionTitle}>🛠️ Loan Tools</Text>
        {loanTools.map((tool) => (
          <TouchableOpacity
            key={tool.title}
            style={[toolItemStyles.toolItem, { marginBottom: 10 }]}
            onPress={() => tool.isActive && handleNavigate(tool.screen)}
            activeOpacity={0.7}
          >
            <View style={toolItemStyles.toolIcon}>
              <CalculatorIcon name={tool.icon} size={22} color={colors.primary} />
            </View>
            <View style={toolItemStyles.toolContent}>
              <Text style={toolItemStyles.toolTitle}>{tool.title}</Text>
              <Text style={toolItemStyles.toolDescription}>{tool.description}</Text>
            </View>
            <Text style={toolItemStyles.toolArrow}>→</Text>
          </TouchableOpacity>
        ))}

        {/* Ad Placeholder */}
        <View style={styles.adPlaceholder}>
          <Text style={styles.adPlaceholderText}>Ad Banner Placeholder</Text>
        </View>
      </ScrollView>
    </View>
  );
});
