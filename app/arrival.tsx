import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { CluckieMascot } from '@/components/CluckieBrand';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function ArrivalScreen() {
  const trip = useRoostopStore((s) => s.activeTrip); const endTrip = useRoostopStore((s) => s.endTrip);
  return <View className="flex-1 bg-white"><SafeAreaView className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-7"><View className="flex-1 items-center justify-center"><CluckieMascot variant="login" width={260} height={245}/><Text className="mt-4 text-center text-[34px] font-black text-ink">You’ve arrived!</Text><Text className="mt-3 max-w-sm text-center text-base leading-6 text-muted">{trip ? `You made it to ${trip.destination.name}.` : 'Your destination alarm is complete.'}</Text></View><AppButton title="Finish trip" onPress={() => { endTrip(); router.replace('/(tabs)'); }}/></SafeAreaView></View>;
}
