import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LoanType, loanTypes } from '../calculators/emi/emiCalculator';

interface LoanTypeSelectorProps {
    selectedType: LoanType;
    onSelectType: (type: LoanType) => void;
}

// Custom icon components for a cleaner look
const PersonalIcon = ({ color, filled }: { color: string; filled: boolean }) => (
    <View style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color }}>{filled ? '👤' : '👤'}</Text>
    </View>
);

const HomeIcon = ({ color, filled }: { color: string; filled: boolean }) => (
    <View style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color }}>{filled ? '🏠' : '🏠'}</Text>
    </View>
);

const CarIcon = ({ color, filled }: { color: string; filled: boolean }) => (
    <View style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color }}>{filled ? '🚗' : '🚗'}</Text>
    </View>
);

const EducationIcon = ({ color, filled }: { color: string; filled: boolean }) => (
    <View style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color }}>{filled ? '🎓' : '🎓'}</Text>
    </View>
);

const getIconComponent = (typeId: LoanType) => {
    switch (typeId) {
        case 'personal':
            return PersonalIcon;
        case 'home':
            return HomeIcon;
        case 'car':
            return CarIcon;
        case 'education':
            return EducationIcon;
        default:
            return PersonalIcon;
    }
};

export const LoanTypeSelector: React.FC<LoanTypeSelectorProps> = memo(({
    selectedType,
    onSelectType,
}) => {
    const { colors, spacing, shadows, isDark } = useTheme();

    // Dynamic colors based on theme
    // Light mode: dark navbar, Dark/Night mode: white navbar
    const navbarBg = isDark ? '#FFFFFF' : '#1f1f1f';
    const iconColorActive = isDark ? '#1f1f1f' : '#e9e5deff'; // Dark icons on white bg, light icons on dark bg
    const iconColorInactive = isDark ? '#1f1f1f' : 'rgb(252, 255, 252)'; // Dark icons on white bg in dark mode

    const styles = StyleSheet.create({
        container: {
            marginBottom: spacing.sm,
            alignItems: 'center',
        },
        pillContainer: {
            flexDirection: 'row',
            backgroundColor: navbarBg,
            borderRadius: 50,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            ...shadows.lg,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
        },
        typeButton: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginHorizontal: spacing.xs,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 56,
        },
        selectedButton: {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            borderColor: isDark ? '#000000' : '#FFFFFF', // White in light, black in dark
        },
        unselectedButton: {
            backgroundColor: 'transparent',
        },
        iconWrapper: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const loanTypeList = Object.values(loanTypes);

    const handleTypePress = useCallback((typeId: LoanType) => {
        onSelectType(typeId);
    }, [onSelectType]);

    return (
        <View style={styles.container}>
            <View style={styles.pillContainer}>
                {loanTypeList.map((type) => {
                    const isSelected = selectedType === type.id;
                    const IconComponent = getIconComponent(type.id);

                    return (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => handleTypePress(type.id)}
                            activeOpacity={0.7}
                            style={[
                                styles.typeButton,
                                isSelected ? styles.selectedButton : styles.unselectedButton,
                            ]}
                        >
                            <View style={styles.iconWrapper}>
                                <IconComponent
                                    color={isSelected ? iconColorActive : iconColorInactive}
                                    filled={isSelected}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});
