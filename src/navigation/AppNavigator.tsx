import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { EmiFormScreen } from '../screens/EmiFormScreen';
import { EmiResultScreen } from '../screens/EmiResultScreen';
import { SipScreen } from '../screens/SipScreen';
import { SipResultScreen } from '../screens/SipResultScreen';
import { FdScreen } from '../screens/FdScreen';
import { FdResultScreen } from '../screens/FdResultScreen';
import { RdScreen } from '../screens/RdScreen';
import { RdResultScreen } from '../screens/RdResultScreen';
import { LoanEligibilityScreen } from '../screens/LoanEligibilityScreen';
import { LoanEligibilityResultScreen } from '../screens/LoanEligibilityResultScreen';
import { PrepaymentScreen } from '../screens/PrepaymentScreen';
import { PrepaymentResultScreen } from '../screens/PrepaymentResultScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';

// Types
import { LoanType } from '../calculators/emi/emiCalculator';

export type RootStackParamList = {
    Home: undefined;
    EmiForm: {
        loanType: LoanType;
    };
    EmiResult: {
        emi: number;
        totalPayment: number;
        totalInterest: number;
        principal: number;
        interestRate: number;
        tenure: number;
        loanType: string;
    };
    Sip: undefined;
    SipResult: {
        monthlyInvestment: number;
        totalInvested: number;
        futureValue: number;
        wealthGain: number;
        annualReturn: number;
        years: number;
    };
    Fd: undefined;
    FdResult: {
        principal: number;
        maturityAmount: number;
        interestEarned: number;
        interestRate: number;
        tenure: number;
        compoundingFrequency: string;
    };
    Rd: undefined;
    RdResult: {
        monthlyDeposit: number;
        totalDeposits: number;
        maturityAmount: number;
        interestEarned: number;
        interestRate: number;
        tenure: number;
    };
    LoanEligibility: {
        prefillInterestRate?: number;
        prefillTenure?: number;
    } | undefined;
    LoanEligibilityResult: {
        monthlyIncome: number;
        existingEMI: number;
        availableForEMI: number;
        maxLoanAmount: number;
        emi: number;
        interestRate: number;
        tenure: number;
        totalPayment: number;
        totalInterest: number;
    };
    Prepayment: {
        prefillLoanAmount?: number;
        prefillInterestRate?: number;
        prefillTenure?: number;
    } | undefined;
    PrepaymentResult: {
        originalLoanAmount: number;
        originalTenure: number;
        originalEMI: number;
        originalTotalPayment: number;
        originalTotalInterest: number;
        prepaymentAmount: number;
        prepaymentYear: number;
        newTenureMonths: number;
        newTotalPayment: number;
        newTotalInterest: number;
        interestSaved: number;
        tenureReduced: number;
        interestRate: number;
    };
    Settings: undefined;
    About: undefined;
    Help: undefined;
    PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { colors, isDark } = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="EmiForm" component={EmiFormScreen} />
                <Stack.Screen name="EmiResult" component={EmiResultScreen} />
                <Stack.Screen name="Sip" component={SipScreen} />
                <Stack.Screen name="SipResult" component={SipResultScreen} />
                <Stack.Screen name="Fd" component={FdScreen} />
                <Stack.Screen name="FdResult" component={FdResultScreen} />
                <Stack.Screen name="Rd" component={RdScreen} />
                <Stack.Screen name="RdResult" component={RdResultScreen} />
                <Stack.Screen name="LoanEligibility" component={LoanEligibilityScreen} />
                <Stack.Screen name="LoanEligibilityResult" component={LoanEligibilityResultScreen} />
                <Stack.Screen name="Prepayment" component={PrepaymentScreen} />
                <Stack.Screen name="PrepaymentResult" component={PrepaymentResultScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="About" component={AboutScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
