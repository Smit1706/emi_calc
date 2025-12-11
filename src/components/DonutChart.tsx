import React, { useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface DonutChartProps {
    principal: number;
    interest: number;
    size?: number;
    strokeWidth?: number;
    icon?: string;
    label?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const DonutChart: React.FC<DonutChartProps> = memo(({
    principal,
    interest,
    size = 180,
    strokeWidth = 20,
    icon = '💰',
    label = 'Loan',
}) => {
    const { colors, typography } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    const total = principal + interest;
    const principalPercentage = total > 0 ? (principal / total) * 100 : 0;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    useEffect(() => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    }, [principal, interest, animatedValue]);

    const principalDashOffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, circumference - (circumference * principalPercentage) / 100],
    });

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        centerContent: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        icon: {
            fontSize: 24,
        },
        label: {
            fontSize: typography.fontSize.sm,
            color: colors.text,
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${center}, ${center}`}>
                    {/* Background circle (Interest) */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={colors.chartInterest}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Principal circle */}
                    <AnimatedCircle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={colors.chartPrincipal}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={principalDashOffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>

            <View style={[styles.centerContent, { width: size, height: size }]}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
        </View>
    );
});
