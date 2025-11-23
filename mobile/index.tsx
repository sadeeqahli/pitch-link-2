// Deprecated import removed - using alternative approach for exception handling
// import ExceptionsManager from 'react-native/Libraries/Core/ExceptionsManager';

if (__DEV__) {
  // Alternative approach for exception handling
  // No custom exception handling needed
}

import 'react-native-url-polyfill/auto';
import './src/__create/polyfills';
global.Buffer = require('buffer').Buffer;

import 'expo-router/entry';
import { AppRegistry } from 'react-native';
import { App } from 'expo-router/build/qualified-entry';

// Simplified error handling - removed create.xyz integrations
AppRegistry.registerComponent('main', () => App);