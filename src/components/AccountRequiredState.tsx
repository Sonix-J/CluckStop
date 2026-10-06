import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/ui';
import { CluckieMascot, type MascotVariant } from '@/components/CluckieBrand';

export function AccountRequiredState({
  title,
  body,
  mascot,
  returnTo,
}: {
  title: string;
  body: string;
  mascot: MascotVariant;
  returnTo: '/(tabs)/trips' | '/(tabs)/saved';
}) {
  return (
    <View className="flex-1 items-center justify-center px-7 pb-16">
      <CluckieMascot variant={mascot} width={230} height={190} />
      <Text className="mt-5 text-center text-[24px] font-bold text-ink">{title}</Text>
      <Text className="mt-3 max-w-sm text-center text-[15px] leading-6 text-muted">{body}</Text>
      <AppButton
        className="mt-8 w-full max-w-sm"
        title="Create Account"
        onPress={() => router.push({ pathname: '/auth/signup', params: { returnTo } })}
      />
      <Pressable
        accessibilityRole="button"
        className="mt-3 min-h-12 items-center justify-center px-8"
        onPress={() => router.push({ pathname: '/auth/login', params: { returnTo } })}
      >
        <Text className="text-[15px] font-bold text-rooster">Sign In</Text>
      </Pressable>
    </View>
  );
}
