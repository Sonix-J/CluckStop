import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { BellRing, MapPin, Navigation } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { CluckieLogo, CluckieMascot } from '@/components/CluckieBrand';
import { colors } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';

const pages = [
  { title: 'Rest easy on the ride.', body: 'Cluckie keeps watch while you rest on the bus, train, or jeepney.', icon: 'mascot' },
  { title: 'Pin your destination.', body: 'Search for your stop or press and hold anywhere on the map.', icon: 'pin' },
  { title: 'We’ll wake you nearby.', body: 'Choose an alert distance and Cluckie will notify you before you arrive.', icon: 'bell' },
] as const;
export default function Onboarding() {
  const [page, setPage] = useState(0); const finish = useRoostopStore((s) => s.finishOnboarding); const current = pages[page];
  return <View className="flex-1 bg-white"><SafeAreaView className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-7 pt-2"><CluckieLogo width={108}/><View className="flex-1 items-center justify-center">{current.icon === 'mascot' ? <CluckieMascot variant="welcome" width={245} height={235}/> : <View className="h-24 w-24 items-center justify-center rounded-full bg-soft-primary">{current.icon === 'pin' ? <MapPin size={42} color={colors.rooster}/> : <BellRing size={42} color={colors.rooster}/>}</View>}<Text className="mt-8 text-center text-[30px] font-bold leading-9 text-ink">{current.title}</Text><Text className="mt-3 max-w-sm text-center text-base leading-6 text-muted">{current.body}</Text></View><View className="mb-6 flex-row justify-center gap-2">{pages.map((_, index) => <View key={index} className={`h-2 rounded-full ${index === page ? 'w-7 bg-rooster' : 'w-2 bg-line'}`}/>)}</View><AppButton title={page === pages.length - 1 ? 'Open Cluckie' : 'Continue'} icon={<Navigation size={19} color="white"/>} onPress={() => { if (page < pages.length - 1) setPage(page + 1); else { finish(); router.replace('/(tabs)'); } }}/></SafeAreaView></View>;
}
