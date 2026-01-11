const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
 
const config = {
  transformer: {
    unstable_allowRequire: {
      'react-native-reanimated': {
        path: 'node_modules/react-native-reanimated',
      },
    },
    experimentalImportSupport: false,
    inlineRequires: true,
  },
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs','json'],
  },
};
 
module.exports = mergeConfig(getDefaultConfig(__dirname), config);