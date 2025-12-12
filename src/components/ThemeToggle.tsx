import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    size?: number;
}

const getStyles = (size: number) => StyleSheet.create({
    container: {
        width: size,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        padding: 2,
    },
    thumb: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    icon: {
        fontSize: 16,
        position: 'absolute',
    },
});

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 60 }) => {
    const { isDark, toggleTheme } = useTheme();
    const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isDark ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isDark, animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, size - 28],
    });

    const backgroundColor = 'rgba(255, 255, 255, 0.3)';
    const thumbColor = '#FFFFFF';

    const sunOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const moonOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });



    return (
        <TouchableOpacity onPress={toggleTheme} activeOpacity={0.8}>
            <Animated.View style={[getStyles(size).container, { backgroundColor }]}>
                <Animated.View 
                    style={[
                        getStyles(size).thumb, 
                        { 
                            backgroundColor: thumbColor,
                            transform: [{ translateX }] 
                        }
                    ]}
                >
                    <Animated.Text style={[getStyles(size).icon, { opacity: sunOpacity }]}>
                        ☀️
                    </Animated.Text>
                    <Animated.Text style={[getStyles(size).icon, { opacity: moonOpacity }]}>
                        🌙
                    </Animated.Text>
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
};