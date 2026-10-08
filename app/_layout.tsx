import '../global.css';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { configureNotifications, readBackgroundTrip } from '@/services/backgroundTasks';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold });
  const hydrated = useRoostopStore((s) => s.hydrated);
  const complete = useRoostopStore((s) => s.onboardingComplete);
  const triggerAlarm = useRoostopStore((s) => s.triggerAlarm);
  const tripStatus = useRoostopStore((s) => s.tripStatus);
  const alarmPlayer = useAudioPlayer(require('../assets/sounds/rooster-crow.mp3'));
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

  useEffect(() => {
    if (!fontsLoaded) return;
    const text = Text as typeof Text & { defaultProps?: { style?: unknown } };
    text.defaultProps = text.defaultProps ?? {};
    text.defaultProps.style = [{ fontFamily: 'Manrope_400Regular' }, text.defaultProps.style];
  }, [fontsLoaded]);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  useEffect(() => {
    if (tripStatus === 'alarming') {
      alarmPlayer.loop = true;
      alarmPlayer.play();
      return;
    }
    alarmPlayer.pause();
    void alarmPlayer.seekTo(0);
  }, [alarmPlayer, tripStatus]);

  if (!hydrated || !fontsLoaded) return null;
  return <GestureHandlerRootView style={{ flex: 1 }}><StatusBar style="auto"/><Stack screenOptions={{ headerShown: false, animation: 'fade' }}><Stack.Screen name="index"/><Stack.Screen name="welcome"/><Stack.Screen name="auth"/><Stack.Screen name="(tabs)"/><Stack.Screen name="onboarding"/><Stack.Screen name="search" options={{ presentation: 'modal' }}/><Stack.Screen name="permissions" options={{ presentation: 'modal' }}/><Stack.Screen name="alarm" options={{ gestureEnabled: false }}/><Stack.Screen name="arrival" options={{ gestureEnabled: false }}/></Stack></GestureHandlerRootView>;
}
