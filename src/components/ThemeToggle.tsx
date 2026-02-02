import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    size?: number;
}

const THUMB_SIZE = 28;

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 60 }) => {
    const { isDark, toggleTheme } = useTheme();
    const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;
    const isDarkRef = useRef(isDark);
    const toggleThemeRef = useRef(toggleTheme);
    const dragOffset = useRef(0);
    const hasMoved = useRef(false);

    // Keep refs updated
    useEffect(() => {
        isDarkRef.current = isDark;
        toggleThemeRef.current = toggleTheme;
    }, [isDark, toggleTheme]);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isDark ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isDark, animatedValue]);

    const panResponder = useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 5;
            },
            onPanResponderGrant: () => {
                hasMoved.current = false;
                dragOffset.current = isDarkRef.current ? size - THUMB_SIZE - 2 : 2;
            },
            onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                if (Math.abs(gestureState.dx) > 5) {
                    hasMoved.current = true;
                }
                const newValue = dragOffset.current + gestureState.dx;
                const clampedValue = Math.max(2, Math.min(newValue, size - THUMB_SIZE));
                const normalizedValue = (clampedValue - 2) / (size - THUMB_SIZE - 2);
                animatedValue.setValue(normalizedValue);
            },
            onPanResponderRelease: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                // If barely moved, treat as tap
                if (!hasMoved.current || Math.abs(gestureState.dx) < 10) {
                    toggleThemeRef.current();
                    return;
                }

                const currentValue = dragOffset.current + gestureState.dx;
                const threshold = size / 2;

                if (currentValue > threshold && !isDarkRef.current) {
                    // Dragged to right - switch to dark mode
                    toggleThemeRef.current();
                } else if (currentValue < threshold && isDarkRef.current) {
                    // Dragged to left - switch to light mode
                    toggleThemeRef.current();
                } else {
                    // Snap back to current position
                    Animated.timing(animatedValue, {
                        toValue: isDarkRef.current ? 1 : 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
        [size, animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, size - THUMB_SIZE],
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

    const styles = StyleSheet.create({
        container: {
            width: size,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            padding: 2,
            backgroundColor,
            borderWidth: isDark ? 0 : 1.5,
            borderColor: isDark ? 'transparent' : '#1A1A1A',
        },
        thumb: {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: thumbColor,
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

    return (
        <Animated.View style={styles.container} {...panResponder.panHandlers}>
            <Animated.View
                style={[
                    styles.thumb,
                    { transform: [{ translateX }] }
                ]}
            >
                <Animated.Text style={[styles.icon, { opacity: sunOpacity }]}>
                    ☀️
                </Animated.Text>
                <Animated.Text style={[styles.icon, { opacity: moonOpacity }]}>
                    🌙
                </Animated.Text>
            </Animated.View>
        </Animated.View>
    );
};