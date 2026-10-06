import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { z } from 'zod';
import { AppButton } from '@/components/ui';
import { AuthCard, AuthInput, AuthScreen } from '@/components/AuthUI';
import { CluckieMascot } from '@/components/CluckieBrand';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState(''); const [error, setError] = useState('');
  const submit = () => { const parsed = z.email('Enter a valid email address').safeParse(email); if (!parsed.success) { setError(parsed.error.issues[0].message); return; } Alert.alert('Password reset is not connected', 'A backend email service is required before Cluckie can send reset links.'); };
  return <AuthScreen><View className="flex-1 justify-center"><View className="items-center"><CluckieMascot variant="thinking" width={235} height={235}/><Text className="text-center text-[27px] font-bold text-ink">Forgot <Text className="text-rooster">Password?</Text></Text><Text className="mt-2 max-w-xs text-center text-sm leading-5 text-muted">No worries, enter your email and <Text className="text-rooster">Cluckie</Text> will send you a link to reset your password.</Text></View><AuthCard><AuthInput label="Email" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} error={error}/><AppButton title="Send Reset Link" onPress={submit}/></AuthCard></View></AuthScreen>;
}
