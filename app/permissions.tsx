import { Linking, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BellRing, ChevronLeft, MapPin, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { CluckieMascot } from '@/components/CluckieBrand';
import { colors } from '@/constants';

const copy = { foreground: ['Allow precise location', 'Cluckie needs your location to measure how close you are to your destination.'], background: ['Allow background location', 'Cluckie needs location access during an active trip so it can alert you while your phone is locked.'], notifications: ['Allow notifications', 'Cluckie needs notifications to sound your destination alarm on the lock screen.'] } as const;
export default function Permissions() {
  const { missing = 'background' } = useLocalSearchParams<{ missing?: keyof typeof copy }>(); const [title, body] = copy[missing] ?? copy.background;
  return <View className="flex-1 bg-white"><SafeAreaView className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-7"><AppButton variant="ghost" title="Back" icon={<ChevronLeft size={20} color={colors.rooster}/>} onPress={() => router.back()} className="self-start px-0"/><View className="flex-1 justify-center"><View className="items-center"><CluckieMascot variant="thinking" width={185} height={175}/></View><Text className="mt-3 text-center text-[28px] font-bold text-ink">{title}</Text><Text className="mt-3 text-center text-base leading-6 text-muted">{body}</Text><View className="mt-7 gap-4"><Line icon={<MapPin size={20} color={colors.rooster}/>} text="Used only when Cluckie needs to monitor a trip"/><Line icon={<BellRing size={20} color={colors.rooster}/>} text="Required for alerts while the screen is locked"/><Line icon={<ShieldCheck size={20} color={colors.rooster}/>} text="Your route is not stored or sent to a server"/></View><View className="mt-7 rounded-xl bg-cream p-4"><Text className="text-sm leading-5 text-ink">GPS, tunnels, low battery, or system restrictions can delay an alert. Stay aware of your surroundings.</Text></View></View><AppButton title="Open system settings" onPress={() => Linking.openSettings()}/><Text className="mt-3 text-center text-xs text-muted">Return to Cluckie after updating the permission.</Text></SafeAreaView></View>;
}
function Line({ icon, text }: { icon: React.ReactNode; text: string }) { return <View className="flex-row items-center">{icon}<Text className="ml-3 flex-1 text-sm leading-5 text-ink">{text}</Text></View>; }
