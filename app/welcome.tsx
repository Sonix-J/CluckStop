import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { BellRing, MapPin, Navigation } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Screen } from '@/components/ui';
import { BrandMark } from '@/components/BrandMark';
import { colors } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function WelcomeScreen() {
  const onboardingComplete = useRoostopStore((state) => state.onboardingComplete);

  return (
    <Screen>
      <SafeAreaView className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-6 pt-2">
        <View className="flex-row items-center py-2">
          <BrandMark size={42} />
          <Text className="ml-2 text-base font-black tracking-[1.8px] text-rooster">ROOSTOP</Text>
        </View>

        <View className="flex-1 justify-center py-8">
          <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-sm">
            <BrandMark size={68} />
          </View>
          <Text className="mt-8 text-[38px] font-black leading-[43px] tracking-[-1px] text-ink dark:text-white">
            Sleep through the ride.{`\n`}Not your stop.
          </Text>
          <Text className="mt-4 max-w-md text-[17px] leading-7 text-muted">
            Set a destination alarm and rest easy. Roostop will wake you when your stop is getting close.
          </Text>

          <View className="mt-8 gap-3">
            <Feature icon={<MapPin size={20} color={colors.rooster} />} text="Pin any destination" />
            <Feature icon={<Navigation size={20} color={colors.rooster} />} text="Choose when you want to be alerted" />
            <Feature icon={<BellRing size={20} color={colors.rooster} />} text="Get a clear wake-up alarm near your stop" />
          </View>
        </View>

        <AppButton
          title="Get started"
          icon={<Navigation size={20} color="white" />}
          onPress={() => router.replace(onboardingComplete ? '/(tabs)' : '/onboarding')}
        />
        <Text className="mt-4 text-center text-xs leading-5 text-muted">
          No account required. Your trip information stays on this device.
        </Text>
      </SafeAreaView>
    </Screen>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View className="min-h-14 flex-row items-center rounded-2xl border border-line bg-panel px-4 py-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-red-50">{icon}</View>
      <Text className="ml-3 flex-1 text-[15px] font-semibold text-ink">{text}</Text>
    </View>
  );
}
