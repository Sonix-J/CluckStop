import { useEffect } from 'react';
import { BackHandler, Text, View, Vibration } from 'react-native';
import { router, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MapPin } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { CluckieMascot } from '@/components/CluckieBrand';
import { disarmTrip } from '@/services/backgroundTasks';
import { useRoostopStore } from '@/store/useRoostopStore';
import { formatDistance } from '@/utils/distance';

export default function AlarmScreen() {
  const trip = useRoostopStore((s) => s.activeTrip); const distance = useRoostopStore((s) => s.alarmDistance); const settings = useRoostopStore((s) => s.settings);
  useEffect(() => { if (settings.vibration) Vibration.vibrate([0, 800, 250, 800, 250, 1200], true); void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); const sub = BackHandler.addEventListener('hardwareBackPress', () => true); return () => { Vibration.cancel(); sub.remove(); }; }, [settings.vibration]);
  if (!trip) { router.replace('/(tabs)'); return null; }
  const acknowledge = async () => { Vibration.cancel(); await disarmTrip(); router.replace('/arrival' as Href); };
  return <View className="flex-1 bg-rooster"><SafeAreaView className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-7"><View className="flex-1 items-center justify-center"><CluckieMascot variant="welcome" width={245} height={230}/><Text className="mt-2 text-center text-[38px] font-black leading-[43px] text-white">You’re almost there.</Text><Text className="mt-3 text-center text-base leading-6 text-white/85">Time to wake up. Your stop is close.</Text><View className="mt-7 w-full rounded-2xl bg-white px-5 py-4"><View className="flex-row items-center"><MapPin size={21} color="#D1263B"/><Text className="ml-2 flex-1 text-lg font-bold text-ink">{trip.destination.name}</Text></View><Text className="mt-2 text-sm text-muted">Approximately <Text className="font-bold text-ink">{formatDistance(distance ?? trip.alertRadius)}</Text> away</Text></View></View><AppButton variant="secondary" title="I’m awake" onPress={acknowledge}/><Text className="mt-4 text-center text-xs leading-5 text-white/75">Look around and prepare to get off safely.</Text></SafeAreaView></View>;
}
