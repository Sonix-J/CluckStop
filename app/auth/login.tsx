import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { z } from 'zod';
import { AppButton } from '@/components/ui';
import { AuthCard, AuthInput, AuthScreen, SocialButtons } from '@/components/AuthUI';
import { CluckieMascot } from '@/components/CluckieBrand';
import { useRoostopStore } from '@/store/useRoostopStore';

const schema = z.object({ username: z.string().min(1, 'Enter your username'), password: z.string().min(6, 'Password must contain at least 6 characters') });
export default function LoginScreen() {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [errors, setErrors] = useState<Record<string,string>>({}); const finish = useRoostopStore(s => s.finishOnboarding);
  const submit = () => { const result = schema.safeParse({ username, password }); if (!result.success) { setErrors(Object.fromEntries(result.error.issues.map(i => [String(i.path[0]), i.message]))); return; } Alert.alert('Account sign-in is not connected', 'Authentication needs a backend provider. You can continue using Cluckie as a guest.'); };
  const guest = () => { finish(); router.replace('/(tabs)'); };
  return <AuthScreen><View className="items-center pt-1"><CluckieMascot variant="login" width={225} height={225}/><Text className="mt-1 text-center text-[27px] font-bold text-ink">Ready for <Text className="text-rooster">another ride?</Text></Text><Text className="mt-1 text-center text-sm text-muted">Sign in and let <Text className="text-rooster">Cluckie</Text> watch your stop.</Text></View><AuthCard><AuthInput label="Username" placeholder="Enter your username" autoCapitalize="none" value={username} onChangeText={setUsername} error={errors.username}/><AuthInput label="Password" placeholder="Enter your password" secureTextEntry value={password} onChangeText={setPassword} error={errors.password}/><Pressable onPress={() => router.push('/auth/forgot-password' as Href)} className="mb-3 self-end py-1"><Text className="text-sm text-rooster">Forgot password?</Text></Pressable><AppButton title="Login" onPress={submit}/><SocialButtons verb="Sign in"/><View className="mt-4 flex-row justify-center"><Text className="text-sm text-muted">Don’t have an account? </Text><Pressable onPress={() => router.push('/auth/signup' as Href)}><Text className="text-sm font-semibold text-rooster">Sign up</Text></Pressable></View></AuthCard><Pressable onPress={guest} className="min-h-12 items-center justify-center"><Text className="text-sm font-semibold text-muted">Continue without an account</Text></Pressable></AuthScreen>;
}
