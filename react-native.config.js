module.exports = {
  dependencies: {
    // Flipper configuration for Android
    ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { android: { sourceDir: '../node_modules/react-native-flipper/android/src/main', packageImportPath: 'import io.invertase.flipper.ReactNativeFlipper;' } } } } : {}),
  },
  assets: [
    './src/assets/fonts/',
  ],
};