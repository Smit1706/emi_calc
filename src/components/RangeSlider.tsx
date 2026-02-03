import React, { memo, useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, TextInput, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface RangeSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    formatValue: (value: number) => string;
    formatMin?: (value: number) => string;
    formatMax?: (value: number) => string;
    suffix?: string;
    currencySymbol?: string;
    onValueChange: (value: number) => void;
}

const THUMB_SIZE = 24;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80;

// Stable helper functions outside component
const getPositionFromValue = (val: number, min: number, max: number): number => {
    const percentage = (val - min) / (max - min);
    return percentage * (SLIDER_WIDTH - THUMB_SIZE);
};

const getValueFromPosition = (position: number, min: number, max: number, step: number): number => {
    const percentage = Math.max(0, Math.min(1, position / (SLIDER_WIDTH - THUMB_SIZE)));
    let newValue = min + percentage * (max - min);
    newValue = Math.round(newValue / step) * step;
    return Math.max(min, Math.min(max, newValue));
};

export const RangeSlider: React.FC<RangeSliderProps> = memo(({
    label,
    value,
    min,
    max,
    step = 1,
    formatValue,
    formatMin,
    formatMax,
    suffix = '',
    currencySymbol,
    onValueChange,
}) => {
    const { colors, spacing, typography, isDark } = useTheme();
    const pan = useRef(new Animated.Value(0)).current;
    const [inputValue, setInputValue] = useState(formatValue(value));

    // Refs to avoid stale closures in PanResponder
    const valueRef = useRef(value);
    const onValueChangeRef = useRef(onValueChange);
    valueRef.current = value;
    onValueChangeRef.current = onValueChange;

    React.useEffect(() => {
        pan.setValue(getPositionFromValue(value, min, max));
        setInputValue(formatValue(value));
    }, [value, min, max, formatValue, pan]);

    const handleInputChange = useCallback((text: string) => {
        setInputValue(text);
    }, []);

    const handleInputBlur = useCallback(() => {
        const parsed = parseFloat(inputValue.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) {
            const clamped = Math.max(min, Math.min(max, parsed));
            onValueChange(clamped);
        } else {
            setInputValue(formatValue(value));
        }
    }, [inputValue, min, max, onValueChange, formatValue, value]);

    const panResponder = useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => { },
            onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                const currentPos = getPositionFromValue(valueRef.current, min, max);
                let newPosition = currentPos + gestureState.dx;

                if (newPosition < 0) {
                    newPosition = 0;
                    onValueChangeRef.current(min);
                } else if (newPosition > (SLIDER_WIDTH - THUMB_SIZE)) {
                    newPosition = SLIDER_WIDTH - THUMB_SIZE;
                    onValueChangeRef.current(max);
                } else {
                    const newValue = getValueFromPosition(newPosition, min, max, step);
                    onValueChangeRef.current(newValue);
                }
                pan.setValue(newPosition);
            },
        })
        , [min, max, step, pan]);

    // Memoized styles to prevent recreation on every render
    const styles = useMemo(() => StyleSheet.create({
        container: {
            marginBottom: spacing.sm,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        label: {
            fontSize: typography.fontSize.md,
            color: isDark ? '#FFFFFF' : colors.text,
            fontWeight: '500',
        },
        valueContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.border,
            paddingHorizontal: suffix ? 8 : 12,
            paddingVertical: 6,
        },
        currencySymbol: {
            fontSize: typography.fontSize.md,
            color: isDark ? '#FFFFFF' : '#1F2937',
            marginRight: 4,
        },
        valueInput: {
            fontSize: typography.fontSize.md,
            color: isDark ? '#FFFFFF' : '#1F2937',
            fontWeight: '600',
            minWidth: suffix ? 50 : 80,
            textAlign: 'right',
            padding: 0,
        },
        suffix: {
            fontSize: typography.fontSize.md,
            color: isDark ? '#FFFFFF' : '#1F2937',
            marginLeft: 4,
        },
        sliderContainer: {
            height: 40,
            justifyContent: 'center',
            paddingHorizontal: 15,
            paddingVertical: 10,
            overflow: 'hidden',
        },
        track: {
            height: 4,
            backgroundColor: '#E0E0E0',
            borderRadius: 2,
            width: SLIDER_WIDTH - THUMB_SIZE,
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
            marginTop: -10,
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
        },
        rangeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: -5,
        },
        rangeText: {
            fontSize: typography.fontSize.xs,
            color: colors.textMuted,
        },
    }), [spacing, typography, isDark, colors, suffix]);

    // Memoized formatted range labels
    const minLabel = useMemo(() =>
        formatMin ? formatMin(min) : `${currencySymbol && !suffix ? currencySymbol : ''}${formatValue(min)}${suffix}`,
        [formatMin, min, currencySymbol, suffix, formatValue]
    );
    const maxLabel = useMemo(() =>
        formatMax ? formatMax(max) : `${currencySymbol && !suffix ? currencySymbol : ''}${formatValue(max)}${suffix}`,
        [formatMax, max, currencySymbol, suffix, formatValue]
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.valueContainer}>
                    {currencySymbol && !suffix && <Text style={styles.currencySymbol}>{currencySymbol}</Text>}
                    <TextInput
                        style={styles.valueInput}
                        value={inputValue}
                        onChangeText={handleInputChange}
                        onBlur={handleInputBlur}
                        keyboardType="numeric"
                        selectTextOnFocus
                    />
                    {suffix && <Text style={styles.suffix}>{suffix}</Text>}
                </View>
            </View>

            <View style={styles.sliderContainer}>
                <View style={styles.track} />
                <Animated.View
                    style={[
                        styles.progress,
                        { width: pan }
                    ]}
                />
                <Animated.View
                    style={[
                        styles.thumb,
                        { transform: [{ translateX: pan }] }
                    ]}
                    {...panResponder.panHandlers}
                />
            </View>

            <View style={styles.rangeContainer}>
                <Text style={styles.rangeText}>{minLabel}</Text>
                <Text style={styles.rangeText}>{maxLabel}</Text>
            </View>
        </View>
    );
});