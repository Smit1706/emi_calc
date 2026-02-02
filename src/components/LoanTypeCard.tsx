import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CalculatorIcon } from './CalculatorIcon';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface LoanTypeCardProps {
    icon: string;
    label: string;
    description?: string;
    isSelected: boolean;
    onPress: () => void;
}

export const LoanTypeCard: React.FC<LoanTypeCardProps> = memo(({
    icon,
    label,
    description,
    isSelected,
    onPress,
}) => {
    const { colors, spacing, isDark } = useTheme();

    const styles = StyleSheet.create({
        card: {
            width: CARD_WIDTH,
            padding: spacing.md,
            borderRadius: 16,
            backgroundColor: isDark
                ? isSelected
                    ? 'rgba(255, 193, 7, 0.15)'
                    : 'rgba(255, 255, 255, 0.08)'
                : isSelected
                    ? 'rgba(255, 193, 7, 0.1)'
                    : '#FFFFFF',
            borderWidth: 2,
            borderColor: isSelected
                ? colors.primary
                : isDark
                    ? 'rgba(255, 255, 255, 0.15)'
                    : '#E5E7EB',
            marginBottom: spacing.sm,
            shadowColor: isSelected ? colors.primary : '#000',
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.25 : 0.1,
            shadowRadius: isSelected ? 8 : 4,
            elevation: isSelected ? 8 : 3,
        },
        iconContainer: {
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: isSelected
                ? colors.primary + '30'
                : isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.sm,
            alignSelf: 'center',
        },
        icon: {
            fontSize: 28,
        },
        label: {
            fontSize: 15,
            fontWeight: '600',
            color: isSelected ? colors.primary : colors.text,
            textAlign: 'center',
            marginBottom: 4,
        },
        description: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        selectedBadge: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkmark: {
            color: '#1A1A2E',
            fontSize: 12,
            fontWeight: '700',
        },
    });

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {isSelected && (
                <View style={styles.selectedBadge}>
                    <Text style={styles.checkmark}>✓</Text>
                </View>
            )}
            <View style={styles.iconContainer}>
                {icon.length > 2 ? (
                    <CalculatorIcon name={icon} size={32} color={isSelected ? colors.primary : colors.textMuted} />
                ) : (
                    <Text style={styles.icon}>{icon}</Text>
                )}
            </View>
            <Text style={styles.label}>{label}</Text>
            {description && (
                <Text style={styles.description}>{description}</Text>
            )}
        </TouchableOpacity>
    );
});
