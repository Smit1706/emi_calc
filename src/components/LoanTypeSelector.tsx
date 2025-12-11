import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LoanType, loanTypes } from '../utils/emiCalculator';

interface LoanTypeSelectorProps {
    selectedType: LoanType;
    onSelectType: (type: LoanType) => void;
}

export const LoanTypeSelector: React.FC<LoanTypeSelectorProps> = memo(({
    selectedType,
    onSelectType,
}) => {
    const { colors, spacing, borderRadius, typography, shadows } = useTheme();

    const styles = StyleSheet.create({
        container: {
            marginBottom: spacing.lg,
        },
        typeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.sm,
        },
        typeButton: {
            flex: 1,
        },
        typeCard: {
            alignItems: 'center',
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.sm,
            borderRadius: borderRadius.lg,
            marginHorizontal: spacing.xs,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        selectedCard: {
            backgroundColor: colors.primary,
            borderColor: colors.primaryDark,
            ...shadows.md,
        },
        unselectedCard: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        icon: {
            fontSize: 28,
            marginBottom: spacing.xs,
        },
        label: {
            fontSize: typography.fontSize.xs,
            fontWeight: '600',
            textAlign: 'center',
        },
        selectedLabel: {
            color: colors.text,
        },
        unselectedLabel: {
            color: colors.textSecondary,
        },
    });

    const loanTypeList = Object.values(loanTypes);
    
    const handleTypePress = useCallback((typeId: LoanType) => {
        onSelectType(typeId);
    }, [onSelectType]);

    return (
        <View style={styles.container}>
            <View style={styles.typeRow}>
                {loanTypeList.map((type) => {
                    const isSelected = selectedType === type.id;
                    return (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => handleTypePress(type.id)}
                            activeOpacity={0.7}
                            style={styles.typeButton}
                        >
                            <View
                                style={[
                                    styles.typeCard,
                                    isSelected ? styles.selectedCard : styles.unselectedCard,
                                ]}
                            >
                                <Text style={styles.icon}>{type.icon}</Text>
                                <Text
                                    style={[
                                        styles.label,
                                        isSelected ? styles.selectedLabel : styles.unselectedLabel,
                                    ]}
                                >
                                    {type.name.split(' ')[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});
