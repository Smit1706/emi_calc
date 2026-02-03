/**
 * Analytics Service - Firebase Analytics Integration
 * 
 * This is a placeholder for Firebase Analytics.
 * When ready to implement, install: expo-firebase-analytics
 * 
 * Events to track:
 * - Screen views
 * - Calculator usage
 * - Theme changes
 * - Session metrics
 */

// Event Types
export type AnalyticsEvent =
    | 'app_open'
    | 'screen_view'
    | 'calculate_emi'
    | 'calculate_sip'
    | 'calculate_fd'
    | 'theme_change'
    | 'compare_again'
    | 'back_to_home';

export type ScreenName =
    | 'Home'
    | 'Emi'
    | 'EmiResult'
    | 'Sip'
    | 'SipResult'
    | 'Fd'
    | 'FdResult'
    | 'Settings'
    | 'About';

interface EMIEventParams {
    loan_type: string;
    amount: number;
    rate: number;
    tenure: number;
    emi: number;
}

interface SIPEventParams {
    monthly_amount: number;
    return_rate: number;
    years: number;
    future_value: number;
}

interface FDEventParams {
    principal: number;
    rate: number;
    tenure: number;
    maturity_amount: number;
}

/**
 * Analytics Service Class
 * Production-ready - silent stubs until Firebase is integrated
 */
class AnalyticsService {
    private isInitialized: boolean = false;

    /**
     * Initialize analytics
     */
    async initialize(): Promise<void> {
        // TODO: Initialize Firebase Analytics
        // import analytics from '@react-native-firebase/analytics';
        // await analytics().setAnalyticsCollectionEnabled(true);
        this.isInitialized = true;
    }

    /**
     * Log screen view
     */
    async logScreenView(_screenName: ScreenName): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: await analytics().logScreenView({ screen_name, screen_class });
    }

    /**
     * Log EMI calculation
     */
    async logEMICalculation(_params: EMIEventParams): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: await analytics().logEvent('calculate_emi', params);
    }

    /**
     * Log SIP calculation
     */
    async logSIPCalculation(_params: SIPEventParams): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: Implement Firebase call
    }

    /**
     * Log FD calculation
     */
    async logFDCalculation(_params: FDEventParams): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: Implement Firebase call
    }

    /**
     * Log theme change
     */
    async logThemeChange(_theme: 'light' | 'dark'): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: Implement Firebase call
    }

    /**
     * Log custom event
     */
    async logEvent(_eventName: AnalyticsEvent, _params?: Record<string, unknown>): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: Implement Firebase call
    }

    /**
     * Set user property
     */
    async setUserProperty(_name: string, _value: string): Promise<void> {
        if (!this.isInitialized) return;
        // TODO: Implement Firebase call
    }
}

// Export singleton instance
export const analytics = new AnalyticsService();

/**
 * Implementation Guide:
 * 
 * 1. Install Firebase:
 *    npx expo install @react-native-firebase/app @react-native-firebase/analytics
 * 
 * 2. Add google-services.json to android/app/
 * 
 * 3. Update app.json plugins
 * 
 * 4. Replace TODO comments with actual Firebase calls
 * 
 * 5. Initialize in App.tsx useEffect
 */
