# EMI Calculator Pro

A professional EMI (Equated Monthly Installment) Calculator app built with React Native and Expo.

## Features

- 📊 **Multiple Loan Types**: Personal, Home, Car, and Education loans
- 🎨 **Premium UI**: Modern design with animations and donut chart visualization
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 💰 **Real-time EMI Calculation**: Instant updates as you adjust parameters
- 📱 **Play Store Ready**: Optimized for Android deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Testing on Device

1. Install **Expo Go** from Play Store
2. Scan the QR code shown in terminal
3. The app will load on your device

## Building for Play Store

### Generate APK (Testing)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build preview APK
eas build --platform android --profile preview
```

### Generate AAB (Production)

```bash
# Build production bundle
eas build --platform android --profile production
```

### Submit to Play Store

1. Create a Google Play Console developer account
2. Create a new app in Play Console
3. Generate a service account key (JSON)
4. Save as `google-service-account.json` in project root
5. Run:
```bash
eas submit --platform android --profile production
```

## Project Structure

```
src/
├── components/
│   ├── DonutChart.tsx      # Animated donut chart
│   ├── EMISlider.tsx       # Custom slider with input
│   ├── LoanSummary.tsx     # Summary display
│   └── LoanTypeSelector.tsx # Loan type tabs
├── context/
│   └── ThemeContext.tsx    # Dark mode provider
├── screens/
│   └── HomeScreen.tsx      # Main calculator screen
├── theme/
│   └── index.ts            # Design tokens
└── utils/
    └── emiCalculator.ts    # EMI calculation logic
```

## EMI Formula

```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
```

Where:
- **P** = Principal loan amount
- **R** = Monthly interest rate (annual rate / 12 / 100)
- **N** = Number of monthly installments

## License

MIT License
