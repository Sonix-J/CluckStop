import '../global.css';
import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { configureNotifications, readBackgroundTrip } from '@/services/backgroundTasks';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function RootLayout() {
  const hydrated = useRoostopStore(s => s.hydrated), complete = useRoostopStore(s => s.onboardingComplete), triggerAlarm = useRoostopStore(s => s.triggerAlarm);
  const segments = useSegments(); const router = useRouter();
  useEffect(() => { configureNotifications().catch(() => undefined); readBackgroundTrip().then(t => { if (t?.alarmTriggered) { triggerAlarm(t.alarmDistance); router.replace('/alarm'); } }); const sub = Notifications.addNotificationResponseReceivedListener(r => { if (r.notification.request.content.data?.alarm) router.push('/alarm'); }); return () => sub.remove(); }, []);
  useEffect(() => { if (!hydrated) return; const inOnboarding = segments[0] === 'onboarding'; const onWelcome = segments[0] === 'welcome'; if (!complete && !inOnboarding && !onWelcome) router.replace('/welcome'); else if (complete && inOnboarding) router.replace('/(tabs)'); }, [hydrated, complete, segments]);
  if (!hydrated) return null;
  return <GestureHandlerRootView style={{ flex: 1 }}><StatusBar style="auto"/><Stack screenOptions={{ headerShown: false, animation: 'fade' }}><Stack.Screen name="welcome"/><Stack.Screen name="(tabs)"/><Stack.Screen name="onboarding"/><Stack.Screen name="search" options={{ presentation: 'modal' }}/><Stack.Screen name="permissions" options={{ presentation: 'modal' }}/><Stack.Screen name="alarm" options={{ gestureEnabled: false }}/></Stack></GestureHandlerRootView>;
}
