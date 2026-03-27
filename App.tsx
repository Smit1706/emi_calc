import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';
import { ThemeProvider } from './src/context/ThemeContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { analytics } from './src/analytics/AnalyticsService';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might cause this error, safe to ignore */
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize analytics and other services
        await analytics.initialize();
        analytics.logEvent('app_open');
      } catch (e) {
        // Silent fail for general preparation
        console.error("App preparation error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (!appIsReady) {
      return;
    }

    mobileAds()
      .initialize()
      .catch((error) => {
        console.warn('AdMob initialization failed:', error);
      });
  }, [appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately!
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <CurrencyProvider>
          <AppNavigator />
        </CurrencyProvider>
      </ThemeProvider>
    </View>
  );
}
