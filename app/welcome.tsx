import { Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { CluckieLogo, CluckieMascot } from '@/components/CluckieBrand';

export default function WelcomeScreen() {
  return <View className="flex-1 bg-white"><SafeAreaView className="mx-auto w-full max-w-[520px] flex-1 px-6 pb-8 pt-3"><CluckieLogo width={112}/><View className="flex-1 items-center justify-center"><CluckieMascot variant="welcome" width={330} height={330}/><Text className="mt-4 text-center text-[23px] font-bold leading-8 text-rooster">Sleep through the ride, not your stop.</Text><Text className="mt-2 max-w-sm text-center text-sm leading-5 text-muted">Set your destination and Cluckie will wake you when you’re getting close.</Text></View><AppButton title="Get started" className="mx-auto w-full max-w-[180px]" onPress={() => router.push('/auth/login' as Href)}/></SafeAreaView></View>;
}
