import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { BellRing, Check, LocateFixed, Play, ShieldCheck, Smartphone, Vibrate } from 'lucide-react-native';
import { useAudioPlayer } from 'expo-audio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '@/components/ui';
import { colors, RADII } from '@/constants';
import { useRoostopStore, type AlarmSound } from '@/store/useRoostopStore';
import { formatDistance } from '@/utils/distance';

export default function Settings() {
  const settings = useRoostopStore((s) => s.settings);
  const update = useRoostopStore((s) => s.updateSettings);
  const alarmSound = useRoostopStore((s) => s.alarmSound);
  const setAlarmSound = useRoostopStore((s) => s.setAlarmSound);
  const bellPreview = useAudioPlayer(require('../../assets/sounds/classic-bell.mp3'));
  const roosterPreview = useAudioPlayer(require('../../assets/sounds/rooster-crow.mp3'));
  const cluckPreview = useAudioPlayer(require('../../assets/sounds/gentle-cluck.mp3'));
  const previewSound = (sound: AlarmSound) => {
    [bellPreview, roosterPreview, cluckPreview].forEach((player) => player.pause());
    const player = sound === 'rooster-crow' ? roosterPreview : sound === 'gentle-cluck' ? cluckPreview : bellPreview;
    void player.seekTo(0);
    player.play();
    setAlarmSound(sound);
  };
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <View className="px-5 pb-4 pt-4">
            <Text className="mt-5 text-[28px] font-bold text-ink">Settings</Text>
          </View>
          <Section title="Alarm">
            <Setting icon={<BellRing size={20} color={colors.rooster} />} title="Default alert distance" body={formatDistance(settings.defaultRadius)}>
              <AppButton variant="ghost" title="Change" className="min-h-11 px-2" onPress={() => update({ defaultRadius: RADII[(RADII.indexOf(settings.defaultRadius) + 1) % RADII.length] })} />
            </Setting>
            <Setting icon={<Vibrate size={20} color={colors.rooster} />} title="Vibration" body="Vibrate when your stop is near">
              <Switch value={settings.vibration} onValueChange={(value) => update({ vibration: value })} trackColor={{ false: colors.line, true: colors.rooster }} />
            </Setting>
            <Setting icon={<Smartphone size={20} color={colors.rooster} />} title="Alarm sound" body="Play a notification sound">
              <Switch value={settings.sound} onValueChange={(value) => update({ sound: value })} trackColor={{ false: colors.line, true: colors.rooster }} />
            </Setting>
            <View className="px-4 py-4">
              <Text className="mb-3 text-sm font-semibold text-ink">Wake-up sound</Text>
              <View className="gap-2">
                {([
                  ['classic-bell', 'Classic Bell', 'Clear and attention-grabbing'],
                  ['rooster-crow', 'Rooster Crow', 'Cluckie’s signature wake-up'],
                  ['gentle-cluck', 'Gentle Cluck', 'Playful and less intense'],
                ] as const).map(([value, label, description]) => {
                  const selected = alarmSound === value;
                  return (
                    <Pressable
                      key={value}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => previewSound(value)}
                      className={`min-h-[64px] flex-row items-center rounded-xl border px-3 py-2 ${selected ? 'border-rooster bg-red-50' : 'border-line bg-white'}`}
                    >
                      <View className="h-9 w-9 items-center justify-center">
                        {selected ? <Check size={20} color={colors.rooster} /> : <Play size={19} color={colors.muted} />}
                      </View>
                      <View className="ml-2 flex-1">
                        <Text className="text-sm font-bold text-ink">{label}</Text>
                        <Text className="mt-0.5 text-xs text-muted">{description}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Section>
          <Section title="Access">
            <Setting icon={<LocateFixed size={20} color={colors.rooster} />} title="Location & notifications" body="Review system permissions">
              <AppButton variant="ghost" title="Review" className="min-h-11 px-2" onPress={() => router.push('/permissions')} />
            </Setting>
          </Section>
          <View className="mx-5 mt-2 rounded-2xl border border-line bg-white p-4">
            <View className="flex-row items-center"><ShieldCheck size={21} color={colors.rooster} /><Text className="ml-2 font-bold text-ink">Private by default</Text></View>
            <Text className="mt-2 text-sm leading-5 text-muted">Cluckie stores saved stops and trip summaries locally. It does not keep your complete route.</Text>
          </View>
          <Text className="mt-7 text-center text-xs text-muted">Cluckie 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View className="mb-5"><Text className="mb-2 px-5 text-xs font-bold uppercase tracking-[1.4px] text-muted">{title}</Text><View className="mx-5 overflow-hidden rounded-2xl border border-line bg-white">{children}</View></View>;
}

function Setting({ icon, title, body, children }: { icon: React.ReactNode; title: string; body: string; children: React.ReactNode }) {
  return <View className="min-h-[68px] flex-row items-center border-b border-line px-4 py-3 last:border-b-0">{icon}<View className="ml-3 flex-1"><Text className="text-[15px] font-semibold text-ink">{title}</Text><Text className="mt-0.5 text-xs text-muted">{body}</Text></View>{children}</View>;
}
