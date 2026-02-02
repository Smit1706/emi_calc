import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface CalculatorIconProps {
    name: string;
    size?: number;
    color?: string;
}

export const CalculatorIcon: React.FC<CalculatorIconProps> = ({
    name,
    size = 24,
    color = '#3B82F6'
}) => {
    const viewBox = "0 0 24 24";

    switch (name) {
        case 'personal':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'home':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'car':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M7 17C8.10457 17 9 16.1046 9 15C9 13.8954 8.10457 13 7 13C5.89543 13 5 13.8954 5 15C5 16.1046 5.89543 17 7 17Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M17 17C18.1046 17 19 16.1046 19 15C19 13.8954 18.1046 13 17 13C15.8954 13 15 13.8954 15 15C15 16.1046 15.8954 17 17 17Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M5 15H3V9L5 3H19L21 9V15H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M5 9H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'education':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M22 10L12 5L2 10L12 15L22 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M6 12V17C6 17 8 20 12 20C16 20 18 17 18 17V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'sip':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'fd':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
                    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
                    <Path d="M12 9V12H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </Svg>
            );
        case 'rd':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
                    <Path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </Svg>
            );
        case 'eligibility':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85782 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M22 4L12 14.01L9 11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'prepayment':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M12 1L12 23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        case 'sun':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
                    <Path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </Svg>
            );
        case 'moon':
            return (
                <Svg width={size} height={size} viewBox={viewBox} fill="none">
                    <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );
        default:
            return null;
    }
};
