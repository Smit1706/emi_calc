import React, { memo, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, TextInput } from 'react-native';
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
    onValueChange: (value: number) => void;
}

const SLIDER_WIDTH = Dimensions.get('window').width - 80;
const THUMB_SIZE = 32;

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
    onValueChange,
}) => {
    const { colors, spacing, typography } = useTheme();
    const pan = useRef(new Animated.Value(0)).current;
    const [inputValue, setInputValue] = useState(formatValue(value));
    
    const getPositionFromValue = (val: number) => {
        const percentage = (val - min) / (max - min);
        return percentage * (SLIDER_WIDTH - THUMB_SIZE);
    };
    
    const getValueFromPosition = (position: number) => {
        const percentage = Math.max(0, Math.min(1, position / (SLIDER_WIDTH - THUMB_SIZE)));
        let newValue = min + percentage * (max - min);
        newValue = Math.round(newValue / step) * step;
        return Math.max(min, Math.min(max, newValue));
    };
    
    React.useEffect(() => {
        pan.setValue(getPositionFromValue(value));
        setInputValue(formatValue(value));
    }, [value]);
    
    const handleInputChange = (text: string) => {
        setInputValue(text);
    };
    
    const handleInputBlur = () => {
        const parsed = parseFloat(inputValue.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) {
            const clamped = Math.max(min, Math.min(max, parsed));
            onValueChange(clamped);
        } else {
            setInputValue(formatValue(value));
        }
    };
    
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // Don't jump, just prepare for drag
            },
            onPanResponderMove: (_, gestureState) => {
                const currentPos = getPositionFromValue(value);
                let newPosition = currentPos + gestureState.dx;
                
                // Allow dragging beyond bounds but clamp the value
                if (newPosition < 0) {
                    newPosition = 0;
                    onValueChange(min); // Set to minimum when dragged left
                } else if (newPosition > (SLIDER_WIDTH - THUMB_SIZE)) {
                    newPosition = SLIDER_WIDTH - THUMB_SIZE;
                    onValueChange(max); // Set to maximum when dragged right
                } else {
                    const newValue = getValueFromPosition(newPosition);
                    onValueChange(newValue);
                }
                
                pan.setValue(newPosition);
            },
        })
    ).current;

    const styles = StyleSheet.create({
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
            color: colors.text,
            fontWeight: '500',
        },
        valueContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: suffix ? 8 : 12, // Less padding for rates/tenure
            paddingVertical: 6,
        },
        currencySymbol: {
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
            marginRight: 4,
        },
        valueInput: {
            fontSize: typography.fontSize.md,
            color: colors.primary,
            fontWeight: '600',
            minWidth: suffix ? 50 : 80, // Smaller for rates/tenure, larger for amounts
            textAlign: 'right',
            padding: 0,
        },
        suffix: {
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
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
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            width: SLIDER_WIDTH - THUMB_SIZE,
        },
        progress: {
            position: 'absolute',
            height: 8,
            backgroundColor: colors.primary,
            borderRadius: 4,
        },
        thumb: {
            position: 'absolute',
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: colors.primary,
            marginTop: -12,
            borderWidth: 4,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 6,
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
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.valueContainer}>
                    {!suffix && <Text style={styles.currencySymbol}>₹</Text>}
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
                <Text style={styles.rangeText}>
                    {formatMin ? formatMin(min) : `${formatValue(min)}${suffix}`}
                </Text>
                <Text style={styles.rangeText}>
                    {formatMax ? formatMax(max) : `${formatValue(max)}${suffix}`}
                </Text>
            </View>
        </View>
    );
});