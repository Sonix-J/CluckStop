import { Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { CluckieLogo, CluckieMascot } from '@/components/CluckieBrand';

export default function WelcomeScreen() {
  return <View className="flex-1 bg-white"><SafeAreaView className="mx-auto w-full max-w-[520px] flex-1 px-5 pb-6 pt-4"><CluckieLogo width={112}/><View className="flex-1 items-center justify-center px-1"><CluckieMascot variant="welcome" width={310} height={300}/><Text className="mt-5 text-center text-[22px] font-bold leading-7 text-rooster">Sleep through the ride, not your stop.</Text><Text className="mt-3 max-w-sm text-center text-sm leading-5 text-muted">Set your destination and Cluckie will wake you when you’re getting close.</Text></View><AppButton title="Get started" className="mx-auto w-full max-w-[160px]" onPress={() => router.push('/auth/login' as Href)}/></SafeAreaView></View>;
}
