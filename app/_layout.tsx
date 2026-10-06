import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { configureNotifications, readBackgroundTrip } from '@/services/backgroundTasks';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function RootLayout() {
  const hydrated = useRoostopStore((s) => s.hydrated);
  const complete = useRoostopStore((s) => s.onboardingComplete);
  const triggerAlarm = useRoostopStore((s) => s.triggerAlarm);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    void configureNotifications().catch(() => undefined);
    void readBackgroundTrip().then((trip) => {
      if (trip?.alarmTriggered) { triggerAlarm(trip.alarmDistance); router.replace('/alarm'); }
    });
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (response.notification.request.content.data?.alarm) router.push('/alarm');
    });
    return () => subscription.remove();
  }, [router, triggerAlarm]);

  useEffect(() => {
    if (!hydrated) return;
    const first = segments[0] as string | undefined;
    const publicRoute = !first || first === 'welcome' || first === 'auth' || first === 'onboarding';
    if (!complete && !publicRoute) router.replace('/welcome');
    else if (complete && first === 'onboarding') router.replace('/(tabs)');
  }, [hydrated, complete, router, segments]);

  if (!hydrated) return null;
  return <GestureHandlerRootView style={{ flex: 1 }}><StatusBar style="auto"/><Stack screenOptions={{ headerShown: false, animation: 'fade' }}><Stack.Screen name="index"/><Stack.Screen name="welcome"/><Stack.Screen name="auth"/><Stack.Screen name="(tabs)"/><Stack.Screen name="onboarding"/><Stack.Screen name="search" options={{ presentation: 'modal' }}/><Stack.Screen name="permissions" options={{ presentation: 'modal' }}/><Stack.Screen name="alarm" options={{ gestureEnabled: false }}/><Stack.Screen name="arrival" options={{ gestureEnabled: false }}/></Stack></GestureHandlerRootView>;
}
