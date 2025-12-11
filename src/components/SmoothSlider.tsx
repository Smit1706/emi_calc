import React, { memo, useCallback, useRef, useState } from 'react';
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

interface SmoothSliderProps {
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

export const SmoothSlider: React.FC<SmoothSliderProps> = memo(({
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
    const [isDragging, setIsDragging] = useState(false);

    const getPositionFromValue = useCallback((val: number) => {
        const percentage = (val - min) / (max - min);
        return percentage * (SLIDER_WIDTH - THUMB_SIZE);
    }, [min, max]);

    const getValueFromPosition = useCallback((position: number) => {
        const percentage = Math.max(0, Math.min(1, position / (SLIDER_WIDTH - THUMB_SIZE)));
        let newValue = min + percentage * (max - min);
        newValue = Math.round(newValue / step) * step;
        return Math.max(min, Math.min(max, newValue));
    }, [min, max, step]);

    React.useEffect(() => {
        if (!isDragging) {
            pan.setValue(getPositionFromValue(value));
            setInputValue(formatValue(value));
        }
    }, [value, getPositionFromValue, formatValue, isDragging]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsDragging(true);
                pan.extractOffset();
            },
            onPanResponderMove: (_, gestureState) => {
                const newPosition = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, gestureState.dx));
                pan.setValue(newPosition);
                
                // Real-time value update
                const newValue = getValueFromPosition(gestureState.dx + getPositionFromValue(value));
                onValueChange(newValue);
            },
            onPanResponderRelease: () => {
                setIsDragging(false);
                pan.flattenOffset();
            },
        })
    ).current;

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
            height: 6,
            backgroundColor: colors.border,
            borderRadius: 3,
            width: SLIDER_WIDTH,
        },
        progress: {
            position: 'absolute',
            height: 6,
            backgroundColor: colors.primary,
            borderRadius: 3,
        },
        thumb: {
            position: 'absolute',
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: colors.primary,
            borderWidth: 4,
            borderColor: '#fff',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 6,
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
                            keyboardType="numeric"
                            selectTextOnFocus
                            editable={false}
                        />
                        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
                    </View>
                )}
            </View>

            <View style={styles.sliderContainer}>
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