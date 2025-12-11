const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable Hermes for better performance
config.transformer.hermesCommand = 'hermes';

// Optimize bundle size
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable tree shaking
config.resolver.platforms = ['native', 'android', 'ios'];

module.exports = config;