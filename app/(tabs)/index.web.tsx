import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bookmark, LocateFixed, MapPin, Navigation, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Chip, SearchBox } from '@/components/ui';
import { BrandMark } from '@/components/BrandMark';
import { colors, RADII, SAMPLE_DESTINATIONS } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';
import { formatDistance } from '@/utils/distance';
import type { Trip } from '@/types';

export default function WebHome() {
  const destination = useRoostopStore((s) => s.selectedDestination);
  const select = useRoostopStore((s) => s.selectDestination);
  const radius = useRoostopStore((s) => s.alertRadius);
  const setRadius = useRoostopStore((s) => s.setAlertRadius);
  const activeTrip = useRoostopStore((s) => s.activeTrip);
  const status = useRoostopStore((s) => s.tripStatus);
  const startTrip = useRoostopStore((s) => s.startTrip);
  const endTrip = useRoostopStore((s) => s.endTrip);
  const triggerAlarm = useRoostopStore((s) => s.triggerAlarm);
  const saved = useRoostopStore((s) => s.saved);
  const saveDestination = useRoostopStore((s) => s.saveDestination);
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => SAMPLE_DESTINATIONS.filter((item) =>
      `${item.name} ${item.address}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [query],
  );

  if (activeTrip && status !== 'idle') {
    return (
      <View className="min-h-screen flex-1 bg-cream">
        <SafeAreaView className="mx-auto w-full max-w-5xl flex-1 px-5 py-5">
          <View className="flex-row items-center rounded-app border border-line bg-panel p-4">
            <View className="h-3 w-3 rounded-full bg-green-600" />
            <Text className="ml-2 flex-1 text-sm font-bold text-ink">ACTIVE TRIP · WEB PREVIEW</Text>
            <Text className="text-sm text-muted">GPS simulation</Text>
          </View>
          <View className="my-5 min-h-[360px] flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-line bg-[#E9E4DA]">
            <View className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#cfc7b9 1px, transparent 1px), linear-gradient(90deg, #cfc7b9 1px, transparent 1px)', backgroundSize: '42px 42px' } as never} />
            <View className="h-48 w-48 items-center justify-center rounded-full border-2 border-rooster bg-red-100/60">
              <MapPin size={44} color={colors.rooster} />
            </View>
          </View>
          <View className="rounded-[24px] border border-line bg-panel p-6">
            <Text className="text-sm font-bold uppercase tracking-wider text-rooster">Next alarm</Text>
            <Text className="mt-2 text-3xl font-bold text-ink">{activeTrip.destination.name}</Text>
            <Text className="mt-2 text-lg text-muted">Alert radius: {formatDistance(activeTrip.alertRadius)}</Text>
            <View className="mt-5 flex-row flex-wrap gap-3">
              <AppButton title="Preview alarm" onPress={() => { triggerAlarm(activeTrip.alertRadius); router.push('/alarm'); }} />
              <AppButton variant="secondary" title="Stop trip" onPress={endTrip} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const begin = () => {
    if (!destination) return;
    const trip: Trip = {
      id: `web-trip-${Date.now()}`,
      destination,
      startedAt: new Date().toISOString(),
      alertRadius: radius,
      alarmTriggered: false,
    };
    startTrip(trip);
  };

  return (
    <View className="min-h-screen flex-1 bg-cream">
      <SafeAreaView className="mx-auto w-full max-w-6xl flex-1 px-5 py-5">
        <View className="mb-5 flex-row items-center gap-3">
          <BrandMark size={46} />
          <View className="flex-1">
            <Text className="text-xl font-black tracking-wide text-rooster">ROOSTOP</Text>
            <Text className="text-sm text-muted">Web experience preview</Text>
          </View>
        </View>
        <View className="flex-1 gap-5 lg:flex-row">
          <View className="min-h-[430px] flex-[1.45] overflow-hidden rounded-[28px] border border-line bg-[#E9E4DA]">
            <View className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(#cfc7b9 1px, transparent 1px), linear-gradient(90deg, #cfc7b9 1px, transparent 1px)', backgroundSize: '48px 48px' } as never} />
            <View className="absolute left-5 right-5 top-5 z-10">
              <SearchBox value={query} onChangeText={setQuery} placeholder="Where should we wake you?" />
              {query.length > 0 && (
                <View className="mt-2 overflow-hidden rounded-app border border-line bg-panel">
                  {results.map((item) => (
                    <Pressable key={item.id} className="flex-row items-center border-b border-line p-4" onPress={() => { select(item); setQuery(''); }}>
                      <MapPin size={20} color={colors.rooster} />
                      <View className="ml-3">
                        <Text className="font-bold text-ink">{item.name}</Text>
                        <Text className="text-sm text-muted">{item.address}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            <View className="flex-1 items-center justify-center">
              {destination ? (
                <View className="h-48 w-48 items-center justify-center rounded-full border-2 border-rooster bg-red-100/60">
                  <MapPin size={48} color={colors.rooster} />
                </View>
              ) : (
                <View className="items-center rounded-app bg-panel/90 p-6">
                  <LocateFixed size={32} color={colors.rooster} />
                  <Text className="mt-3 font-bold text-ink">Choose a destination above</Text>
                </View>
              )}
            </View>
          </View>
          <ScrollView className="flex-1 rounded-[28px] border border-line bg-panel" contentContainerClassName="p-6">
            {destination ? (
              <>
                <View className="flex-row items-start">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-red-100"><MapPin size={22} color={colors.rooster} /></View>
                  <View className="ml-3 flex-1"><Text className="text-2xl font-bold text-ink">{destination.name}</Text><Text className="mt-1 text-muted">{destination.address}</Text></View>
                  <Pressable accessibilityLabel="Save destination" onPress={() => saveDestination({ ...destination, label: destination.name, defaultRadius: radius })} className="p-2"><Bookmark size={23} color={saved.some((item) => item.id === destination.id) ? colors.rooster : colors.muted} /></Pressable>
                </View>
                <Text className="mb-3 mt-8 text-sm font-bold uppercase tracking-wider text-muted">Alert me before I arrive</Text>
                <View className="flex-row flex-wrap gap-2">{RADII.map((item) => <Chip key={item} selected={radius === item} label={formatDistance(item)} onPress={() => setRadius(item)} />)}</View>
                <View className="mt-7 flex-row items-center"><ShieldCheck size={20} color={colors.rooster} /><Text className="ml-2 flex-1 text-sm leading-5 text-muted">This browser mode previews the experience. Background GPS alarms require the installed iPhone app.</Text></View>
                <AppButton className="mt-6" title="Start preview trip" icon={<Navigation size={20} color="white" />} onPress={begin} />
              </>
            ) : (
              <View className="py-8"><Text className="text-3xl font-bold text-ink">Where should we wake you?</Text><Text className="mt-3 text-base leading-6 text-muted">Search for a Cebu destination to preview the complete trip and alarm flow in your browser.</Text></View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
