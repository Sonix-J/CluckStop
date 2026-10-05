import { useState } from 'react';
import { Text, View } from 'react-native';
import { MapPin, Navigation, BellRing } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton, Screen } from '@/components/ui';
import { BrandMark } from '@/components/BrandMark';
import { colors } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';
const pages = [
  { title: 'Sleep through the ride,\nnot your stop.', body: 'Rest easy on the bus, train, or jeepney. Roostop watches the distance for you.', Icon: BrandMark },
  { title: 'Pin your destination.', body: 'Search for a place or press and hold anywhere on the map to drop a pin.', Icon: MapPin },
  { title: "We’ll wake you\nwhen you’re close.", body: 'Choose an alert distance. Roostop uses location, sound, vibration, and a notification.', Icon: BellRing }
];
export default function Onboarding() { const [page, setPage] = useState(0); const finish = useRoostopStore(s => s.finishOnboarding); const p = pages[page]; return <Screen><SafeAreaView className="flex-1 px-6 pb-6"><View className="flex-row justify-between py-4"><BrandMark size={40}/><Text className="text-base font-bold text-rooster">ROOSTOP</Text></View><View className="flex-1 items-center justify-center"><View className="h-28 w-28 items-center justify-center rounded-full bg-white"><p.Icon size={58} color={colors.rooster}/></View><Text className="mt-10 text-center text-[34px] font-bold leading-[40px] text-ink">{p.title}</Text><Text className="mt-5 max-w-sm text-center text-[17px] leading-7 text-muted">{p.body}</Text></View><View className="mb-6 flex-row justify-center gap-2">{pages.map((_, i) => <View key={i} className={`h-2 rounded-full ${i === page ? 'w-7 bg-rooster' : 'w-2 bg-line'}`}/>)}</View><AppButton title={page === 2 ? 'Get started' : 'Continue'} icon={page < 2 ? <Navigation size={19} color="white"/> : undefined} onPress={() => { if (page < 2) setPage(page + 1); else { finish(); router.replace('/(tabs)'); } }}/></SafeAreaView></Screen>; }
