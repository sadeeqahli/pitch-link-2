import { usePathname, useRouter } from 'expo-router';
import { App } from 'expo-router/build/qualified-entry';
import React, { memo } from 'react';
import { ErrorBoundaryWrapper } from './__create/SharedErrorBoundary';
import './src/__create/polyfills';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import './global.css';

const GlobalErrorReporter = () => {
  return null;
};

const Wrapper = memo(() => {
  return (
    <ErrorBoundaryWrapper>
      <SafeAreaProvider
        initialMetrics={{
          insets: { top: 64, bottom: 34, left: 0, right: 0 },
          frame: {
            x: 0,
            y: 0,
            width: typeof window === 'undefined' ? 390 : window.innerWidth,
            height: typeof window === 'undefined' ? 844 : window.innerHeight,
          },
        }}
      >
        <App />
        <GlobalErrorReporter />
        <Toaster />
      </SafeAreaProvider>
    </ErrorBoundaryWrapper>
  );
});

// Simplified app component - removed all create.xyz integrations
const PitchLinkApp = () => {
  return (
    <>
      <Wrapper />
    </>
  );
};

export default PitchLinkApp;
