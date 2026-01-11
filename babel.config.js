module.exports = {
  presets: ['module:@react-native/babel-preset',
    '@babel/preset-typescript', // keep if you use TypeScript
  ],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ]
};