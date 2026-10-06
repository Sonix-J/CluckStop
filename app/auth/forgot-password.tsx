import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { z } from 'zod';
import { AppButton } from '@/components/ui';
import { AuthCard, AuthInput, AuthScreen } from '@/components/AuthUI';
import { CluckieLogo, CluckieMascot } from '@/components/CluckieBrand';
import { colors } from '@/constants';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const parsed = z.email('Enter a valid email address').safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    Alert.alert('Password reset is not connected', 'A backend email service is required before Cluckie can send reset links.');
  };

  return (
    <AuthScreen>
      <View className="pt-3"><CluckieLogo width={108} /></View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to sign in"
        onPress={() => router.back()}
        className="mt-2 min-h-11 self-start flex-row items-center pr-4"
      >
        <ChevronLeft size={21} color={colors.rooster} />
        <Text className="ml-1 text-sm font-semibold text-rooster">Back to Sign In</Text>
      </Pressable>
      <View className="flex-1 justify-center pb-6">
        <View className="items-center">
          <CluckieMascot variant="thinking" width={215} height={205} />
          <Text className="text-center text-[27px] font-bold text-ink">Forgot <Text className="text-rooster">Password?</Text></Text>
          <Text className="mb-6 mt-2 max-w-xs text-center text-sm leading-5 text-muted">
            No worries, enter your email and <Text className="text-rooster">Cluckie</Text> will send you a link to reset your password.
          </Text>
        </View>
        <AuthCard>
          <AuthInput label="Email" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} error={error} />
          <AppButton title="Send Reset Link" onPress={submit} />
        </AuthCard>
      </View>
    </AuthScreen>
  );
}
