import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface EMISliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    formatValue: (value: number) => string;
    formatMin?: (value: number) => string;
    formatMax?: (value: number) => string;
    suffix?: string;
    onValueChange: (value: number) => void;
    showInput?: boolean;
}

const SLIDER_WIDTH = Dimensions.get('window').width - 80;
const THUMB_SIZE = 24;

export const EMISlider: React.FC<EMISliderProps> = memo(({
    label,
    value,
    min,
    max,
    step = 1,
    formatValue,
    formatMin,
    formatMax,
    suffix = '',
    onValueChange,
    showInput = true,
}) => {
    const { colors, spacing, borderRadius, typography } = useTheme();
    const [inputValue, setInputValue] = useState(formatValue(value));
    const pan = useRef(new Animated.Value(0)).current;
    const sliderRef = useRef<View>(null);
    const currentValue = useRef(value);
    const lastUpdateTime = useRef(0);

    // Calculate position from value
    const getPositionFromValue = useCallback(
        (val: number) => {
            const percentage = (val - min) / (max - min);
            return percentage * (SLIDER_WIDTH - THUMB_SIZE);
        },
        [min, max]
    );

    // Calculate value from position
    const getValueFromPosition = useCallback(
        (position: number) => {
            const percentage = Math.max(0, Math.min(1, position / (SLIDER_WIDTH - THUMB_SIZE)));
            let newValue = min + percentage * (max - min);

            // Apply step
            newValue = Math.round(newValue / step) * step;
            newValue = Math.max(min, Math.min(max, newValue));

            return newValue;
        },
        [min, max, step]
    );

    useEffect(() => {
        pan.setValue(getPositionFromValue(value));
        setInputValue(formatValue(value));
    }, [value, getPositionFromValue, formatValue, pan]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                currentValue.current = getPositionFromValue(value);
                pan.setOffset(currentValue.current);
                pan.setValue(0);
            },
            onPanResponderMove: (_, gestureState) => {
                const newPosition = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, gestureState.dx + currentValue.current));
                pan.setValue(newPosition);
                
                // Throttle updates to reduce lag
                const now = Date.now();
                if (now - lastUpdateTime.current > 50) { // Update every 50ms
                    const newValue = getValueFromPosition(newPosition);
                    if (newValue !== currentValue.current) {
                        currentValue.current = newValue;
                        onValueChange(newValue);
                        lastUpdateTime.current = now;
                    }
                }
            },
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    const handleTrackPress = useCallback((event: any) => {
        const { locationX } = event.nativeEvent;
        const newPosition = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, locationX - THUMB_SIZE / 2));
        
        Animated.spring(pan, {
            toValue: newPosition,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
        }).start();
        
        const newValue = getValueFromPosition(newPosition);
        currentValue.current = newValue;
        onValueChange(newValue);
    }, [pan, getValueFromPosition, onValueChange]);

    const handleInputChange = useCallback((text: string) => {
        setInputValue(text);
    }, []);

    const handleInputBlur = useCallback(() => {
        const parsed = parseFloat(inputValue.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) {
            const clamped = Math.max(min, Math.min(max, parsed));
            currentValue.current = clamped;
            onValueChange(clamped);
        } else {
            setInputValue(formatValue(value));
        }
    }, [inputValue, min, max, onValueChange, formatValue, value]);

    const progressWidth = pan.interpolate({
        inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        extrapolate: 'clamp',
    });

    const styles = StyleSheet.create({
        container: {
            marginBottom: spacing.lg,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        label: {
            fontSize: typography.fontSize.md,
            color: colors.text,
            fontWeight: '500',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: borderRadius.sm,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
        },
        currencySymbol: {
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
            marginRight: 4,
        },
        input: {
            fontSize: typography.fontSize.md,
            color: colors.text,
            minWidth: 80,
            textAlign: 'right',
            padding: 0,
        },
        suffix: {
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
            marginLeft: 4,
        },
        sliderContainer: {
            height: THUMB_SIZE + 16,
            justifyContent: 'center',
        },
        track: {
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            width: SLIDER_WIDTH,
        },
        progress: {
            position: 'absolute',
            height: 4,
            backgroundColor: colors.primary,
            borderRadius: 2,
        },
        thumb: {
            position: 'absolute',
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: colors.primary,
            borderWidth: 3,
            borderColor: colors.primaryLight,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
        },
        rangeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing.sm,
        },
        rangeText: {
            fontSize: typography.fontSize.xs,
            color: colors.textMuted,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                {showInput && (
                    <View style={styles.inputContainer}>
                        {!suffix && <Text style={styles.currencySymbol}>₹</Text>}
                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={handleInputChange}
                            onBlur={handleInputBlur}
                            keyboardType="numeric"
                            selectTextOnFocus
                        />
                        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
                    </View>
                )}
            </View>

            <View style={styles.sliderContainer} onTouchEnd={handleTrackPress} ref={sliderRef}>
                <View style={styles.track} />
                <Animated.View style={[styles.progress, { width: progressWidth }]} />
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            transform: [{ translateX: pan }],
                        },
                    ]}
                    {...panResponder.panHandlers}
                />
            </View>

            <View style={styles.rangeContainer}>
                <Text style={styles.rangeText}>
                    {formatMin ? formatMin(min) : `Min ₹${min.toLocaleString('en-IN')}`}
                </Text>
                <Text style={styles.rangeText}>
                    {formatMax ? formatMax(max) : `Max ₹${max.toLocaleString('en-IN')}`}
                </Text>
            </View>
        </View>
    );
});
