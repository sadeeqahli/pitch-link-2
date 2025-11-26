import { useAuth } from '@/utils/auth/useAuth';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { ErrorBoundaryWrapper } from '../__create/SharedErrorBoundary';
import '../__create/polyfills';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const GlobalErrorReporter = () => {
  return null;
};

export default function RootLayout() {
  const { initiate, isReady } = useAuth();

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

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
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
              <Stack.Screen name="(tabs)" />
              {/* Add explicit routes for standalone screens */}
              <Stack.Screen name="add-pitch" options={{ presentation: 'modal' }} />
              <Stack.Screen name="edit-pitch" options={{ presentation: 'modal' }} />
              <Stack.Screen name="simple-edit-pitch" options={{ presentation: 'modal' }} />
              <Stack.Screen name="add-manual-booking" options={{ presentation: 'modal' }} />
              <Stack.Screen name="add-booking" options={{ presentation: 'modal' }} />
              <Stack.Screen name="booking-receipt" options={{ presentation: 'modal' }} />
              <Stack.Screen name="pitch-analytics" options={{ presentation: 'modal' }} />
              <Stack.Screen name="login" />
              <Stack.Screen name="support" />
            </Stack>
            <GlobalErrorReporter />
            <Toaster />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundaryWrapper>
  );
}