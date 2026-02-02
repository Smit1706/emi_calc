import React, { createContext, useContext, ReactNode } from 'react';

/**
 * AdProvider - Centralized Ad Management
 * 
 * This is a placeholder for AdMob integration.
 * When ready to implement ads, install: react-native-google-mobile-ads
 * 
 * Phase 1 Ads (Planned):
 * - Adaptive Banner on HomeScreen (bottom)
 * - Adaptive Banner on Result screens (bottom)
 * 
 * Phase 2 Ads (Future):
 * - Native ads in home screen
 * - Interstitial after 3rd calculation
 */

interface AdContextType {
    isAdLoaded: boolean;
    showBannerAd: boolean;
    // Ad Unit IDs (Replace with actual IDs before production)
    bannerAdUnitId: string;
    interstitialAdUnitId: string;
    nativeAdUnitId: string;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

// Test Ad Unit IDs (from AdMob)
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
const TEST_NATIVE_ID = 'ca-app-pub-3940256099942544/2247696110';

interface AdProviderProps {
    children: ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
    // In production, implement actual ad loading logic
    const value: AdContextType = {
        isAdLoaded: false,
        showBannerAd: true,
        bannerAdUnitId: TEST_BANNER_ID,
        interstitialAdUnitId: TEST_INTERSTITIAL_ID,
        nativeAdUnitId: TEST_NATIVE_ID,
    };

    return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};

export const useAds = (): AdContextType => {
    const context = useContext(AdContext);
    if (!context) {
        throw new Error('useAds must be used within an AdProvider');
    }
    return context;
};

/**
 * Banner Ad Placeholder Component
 * Replace with actual BannerAd from react-native-google-mobile-ads
 */
export const BannerAdPlaceholder: React.FC<{ style?: any }> = ({ style }) => {
    return null; // Placeholder - returns nothing for now
};

/**
 * Implementation Guide:
 * 
 * 1. Install: npx expo install react-native-google-mobile-ads
 * 
 * 2. Add to app.json:
 * {
 *   "expo": {
 *     "plugins": [
 *       [
 *         "react-native-google-mobile-ads",
 *         {
 *           "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
 *           "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
 *         }
 *       ]
 *     ]
 *   }
 * }
 * 
 * 3. Replace placeholder with:
 * import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
 * 
 * <BannerAd
 *   unitId={TestIds.ADAPTIVE_BANNER}
 *   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
 * />
 */
