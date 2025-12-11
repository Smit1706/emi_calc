import React, { memo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    PanGestureHandler,
    State,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    runOnJS,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface OptimizedSliderProps {
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

export const OptimizedSlider: React.FC<OptimizedSliderProps> = memo(({
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
    
    const translateX = useSharedValue(0);
    const context = useSharedValue({ x: 0 });

    // Calculate position from value
    const getPositionFromValue = useCallback((val: number) => {
        const percentage = (val - min) / (max - min);
        return percentage * (SLIDER_WIDTH - THUMB_SIZE);
    }, [min, max]);

    // Calculate value from position
    const getValueFromPosition = useCallback((position: number) => {
        const percentage = Math.max(0, Math.min(1, position / (SLIDER_WIDTH - THUMB_SIZE)));
        let newValue = min + percentage * (max - min);
        newValue = Math.round(newValue / step) * step;
        return Math.max(min, Math.min(max, newValue));
    }, [min, max, step]);

    React.useEffect(() => {
        translateX.value = getPositionFromValue(value);
    }, [value, getPositionFromValue]);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.x = translateX.value;
        },
        onActive: (event, context) => {
            const newPosition = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, context.x + event.translationX));
            translateX.value = newPosition;
        },
        onEnd: () => {
            const newValue = getValueFromPosition(translateX.value);
            runOnJS(onValueChange)(newValue);
        },
    });

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: translateX.value,
    }));

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
                            value={formatValue(value)}
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
                <Animated.View style={[styles.progress, progressStyle]} />
                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View style={[styles.thumb, thumbStyle]} />
                </PanGestureHandler>
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