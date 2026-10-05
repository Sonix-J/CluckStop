import type { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View, type PressableProps, type TextInputProps } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '@/constants';

export function AppButton({ title, icon, variant = 'primary', loading, className = '', ...props }: PressableProps & { title: string; icon?: ReactNode; variant?: 'primary'|'secondary'|'danger'|'ghost'; loading?: boolean; className?: string }) {
  const styles = variant === 'primary' ? 'bg-rooster' : variant === 'danger' ? 'bg-ink' : variant === 'secondary' ? 'bg-panel border border-line' : 'bg-transparent';
  const text = variant === 'primary' || variant === 'danger' ? 'text-white' : variant === 'ghost' ? 'text-rooster' : 'text-ink';
  return <Pressable accessibilityRole="button" disabled={loading || props.disabled} className={`min-h-14 flex-row items-center justify-center gap-2 rounded-app px-5 active:opacity-80 disabled:opacity-50 ${styles} ${className}`} {...props}>{loading ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.rooster}/> : <>{icon}<Text className={`text-[16px] font-bold ${text}`}>{title}</Text></>}</Pressable>;
}
export function SearchBox({ className = '', ...props }: TextInputProps & { className?: string }) {
  return <View className={`min-h-14 flex-row items-center rounded-app border border-line bg-panel px-4 ${className}`}><Search size={21} color={colors.muted}/><TextInput placeholderTextColor={colors.muted} className="ml-3 flex-1 text-[16px] text-ink" accessibilityLabel="Search destinations" {...props}/></View>;
}
export function Chip({ selected, label, onPress }: { selected?: boolean; label: string; onPress(): void }) { return <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }} className={`min-h-12 items-center justify-center rounded-full border px-4 ${selected ? 'border-rooster bg-rooster' : 'border-line bg-panel'}`}><Text className={`font-semibold ${selected ? 'text-white' : 'text-ink'}`}>{label}</Text></Pressable>; }
export function Screen({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <View className={`flex-1 bg-cream dark:bg-night ${className}`}>{children}</View>; }
export function SectionTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) { return <View className="mb-3 flex-row items-center justify-between"><Text className="text-lg font-bold text-ink dark:text-white">{children}</Text>{action}</View>; }
export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) { return <View className="items-center px-8 py-12">{icon}<Text className="mt-5 text-center text-xl font-bold text-ink dark:text-white">{title}</Text><Text className="mt-2 text-center text-[15px] leading-6 text-muted">{body}</Text></View>; }
