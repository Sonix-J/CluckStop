import { useState, type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants';

export function AuthScreen({ children }: PropsWithChildren) {
  return <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}><SafeAreaView className="flex-1"><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 28 }}>{children}</ScrollView></SafeAreaView></KeyboardAvoidingView>;
}

export function AuthInput({ label, secureTextEntry, error, ...props }: TextInputProps & { label: string; error?: string }) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  return <View className="mb-4"><Text className="mb-2 text-sm font-semibold text-ink">{label}</Text><View className={`min-h-[52px] flex-row items-center rounded-xl bg-[#F3F2F2] px-4 ${error ? 'border border-rooster' : ''}`}><TextInput className="flex-1 text-[15px] text-ink" placeholderTextColor="#8A8581" secureTextEntry={secureTextEntry ? hidden : false} {...props}/>{secureTextEntry && <Pressable accessibilityLabel={hidden ? 'Show password' : 'Hide password'} onPress={() => setHidden(!hidden)} className="h-11 w-11 items-center justify-center"><>{hidden ? <Eye size={19} color={colors.muted}/> : <EyeOff size={19} color={colors.muted}/>}</></Pressable>}</View>{error && <Text className="mt-1 text-xs text-rooster">{error}</Text>}</View>;
}

export function AuthCard({ children }: PropsWithChildren) { return <View className="rounded-2xl border border-line bg-white p-4 shadow-sm">{children}</View>; }

export function SocialButtons({ verb }: { verb: 'Sign in' | 'Sign up' }) {
  return <><Text className="my-4 text-center text-sm text-muted">Or {verb.toLowerCase()} with</Text><View className="flex-row justify-center gap-4"><Pressable accessibilityLabel={`${verb} with Facebook`} className="h-12 w-12 items-center justify-center rounded-xl bg-[#F1F1F3]"><Text className="text-[27px] font-black text-[#1877F2]">f</Text></Pressable><Pressable accessibilityLabel={`${verb} with Google`} className="h-12 w-12 items-center justify-center rounded-xl bg-[#F1F1F3]"><Text className="text-[25px] font-black text-[#4285F4]">G</Text></Pressable></View></>;
}
