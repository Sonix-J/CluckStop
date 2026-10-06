import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { z } from 'zod';
import { AppButton } from '@/components/ui';
import { AuthCard, AuthInput, AuthScreen, SocialButtons } from '@/components/AuthUI';
import { CluckieLogo, CluckieMascot } from '@/components/CluckieBrand';

const schema = z.object({ username: z.string().min(1, 'Enter a username'), password: z.string().min(6, 'Use at least 6 characters'), confirm: z.string() }).refine(v => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });
export default function SignupScreen() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' }); const [errors, setErrors] = useState<Record<string,string>>({});
  const submit = () => { const result = schema.safeParse(form); if (!result.success) { setErrors(Object.fromEntries(result.error.issues.map(i => [String(i.path[0]), i.message]))); return; } Alert.alert('Account creation is not connected', 'Connect an authentication provider before enabling account creation.'); };
  return <AuthScreen><View className="pt-2"><CluckieLogo width={112}/></View><View className="items-center"><CluckieMascot variant="signup" width={210} height={210}/><Text className="text-center text-[27px] font-bold text-ink">Join the <Text className="text-rooster">flock</Text></Text><Text className="mt-1 max-w-xs text-center text-sm leading-5 text-muted">Create your account and let <Text className="text-rooster">Cluckie</Text> keep watch on your ride.</Text></View><AuthCard><AuthInput label="Username" placeholder="Enter your username" value={form.username} onChangeText={v => setForm({...form,username:v})} error={errors.username}/><AuthInput label="Password" placeholder="Enter your password" secureTextEntry value={form.password} onChangeText={v => setForm({...form,password:v})} error={errors.password}/><AuthInput label="Confirm Password" placeholder="Confirm your password" secureTextEntry value={form.confirm} onChangeText={v => setForm({...form,confirm:v})} error={errors.confirm}/><AppButton title="Create Account" onPress={submit}/><SocialButtons verb="Sign up"/><View className="mt-4 flex-row justify-center"><Text className="text-sm text-muted">Already have an account? </Text><Pressable onPress={() => router.back()}><Text className="text-sm font-semibold text-rooster">Sign in</Text></Pressable></View></AuthCard></AuthScreen>;
}
