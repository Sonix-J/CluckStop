import { createElement, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bookmark, ChevronRight, MapPin, Navigation, ShieldCheck, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Chip, SearchBox } from '@/components/ui';
import { colors, RADII, SAMPLE_DESTINATIONS } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';
import { formatDistance } from '@/utils/distance';
import type { Coordinate, Trip } from '@/types';

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
  const authStatus = useRoostopStore((s) => s.authStatus);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return SAMPLE_DESTINATIONS.filter((item) => `${item.name} ${item.address}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  if (activeTrip && status !== 'idle') {
    return (
      <View className="flex-1 items-center bg-[#E9E4DA]">
        <View className="relative w-full max-w-[560px] flex-1 overflow-hidden bg-cream">
          <WebMap coordinate={activeTrip.destination.coordinate} title={activeTrip.destination.name} />
          <SafeAreaView pointerEvents="box-none" className="absolute inset-x-0 top-0 px-4 pt-1">
            <View className="flex-row items-center rounded-2xl border border-line bg-panel px-4 py-3 shadow-sm">
              <View className="h-2.5 w-2.5 rounded-full bg-green-600" />
              <Text className="ml-2 flex-1 text-xs font-extrabold tracking-[1.5px] text-ink">ACTIVE TRIP</Text>
              <Text className="text-xs font-medium text-muted">Web preview</Text>
            </View>
          </SafeAreaView>
          <View className="absolute inset-x-3 bottom-3 rounded-[24px] border border-line bg-panel p-5 shadow-lg">
            <Text className="text-xs font-extrabold uppercase tracking-[1.6px] text-rooster">Next alarm</Text>
            <Text className="mt-2 text-[26px] font-bold leading-8 text-ink">{activeTrip.destination.name}</Text>
            <Text className="mt-1 text-sm text-muted">Wake me {formatDistance(activeTrip.alertRadius)} before arrival</Text>
            <View className="my-4 h-px bg-line" />
            <View className="flex-row items-start"><ShieldCheck size={19} color={colors.rooster} /><Text className="ml-2 flex-1 text-sm leading-5 text-muted">This browser trip is simulated. Use the installed app for live GPS monitoring.</Text></View>
            <AppButton className="mt-5" title="Preview destination alarm" onPress={() => { triggerAlarm(activeTrip.alertRadius); router.push('/alarm'); }} />
            <AppButton className="mt-2" variant="ghost" title="Stop trip" onPress={endTrip} />
          </View>
        </View>
      </View>
    );
  }

  const begin = () => {
    if (!destination) return;
    const trip: Trip = { id: `web-trip-${Date.now()}`, destination, startedAt: new Date().toISOString(), alertRadius: radius, alarmTriggered: false };
    startTrip(trip);
  };
  const isSaved = destination ? saved.some((item) => item.id === destination.id) : false;

  return (
    <View className="flex-1 items-center bg-[#E9E4DA]">
      <View className="relative w-full max-w-[560px] flex-1 overflow-hidden bg-cream">
        <WebMap coordinate={destination?.coordinate} title={destination?.name ?? 'Cebu City'} />
        <SafeAreaView pointerEvents="box-none" className="absolute inset-x-0 top-0 px-4 pt-3">
          <View className="flex-row items-center">
            <View className="flex-1 rounded-app bg-panel shadow-lg"><SearchBox value={query} onChangeText={setQuery} placeholder="Where should we wake you?" /></View>
          </View>
          {query.length > 0 && (
            <View className="mt-2 overflow-hidden rounded-2xl border border-line bg-panel shadow-lg">
              <View className="flex-row items-center border-b border-line px-4 py-3"><Text className="flex-1 text-xs font-bold uppercase tracking-[1.4px] text-muted">Suggested places</Text><Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')} className="p-1"><X size={18} color={colors.muted} /></Pressable></View>
              {results.length ? results.map((item) => (
                <Pressable key={item.id} className="min-h-16 flex-row items-center border-b border-line px-4 py-3 last:border-b-0" onPress={() => { select(item); setQuery(''); }}>
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-red-50"><MapPin size={18} color={colors.rooster} /></View>
                  <View className="ml-3 flex-1"><Text className="text-[15px] font-bold text-ink">{item.name}</Text><Text className="mt-0.5 text-xs text-muted">{item.address}</Text></View>
                  <ChevronRight size={18} color={colors.muted} />
                </Pressable>
              )) : <Text className="px-4 py-5 text-sm text-muted">No matching destinations.</Text>}
            </View>
          )}
        </SafeAreaView>
        {!destination ? (
          <View pointerEvents="none" className="absolute inset-x-0 bottom-0 min-h-[44%] rounded-t-[24px] border-t border-line bg-panel px-5 pb-8 pt-6 shadow-lg">
            <Text className="text-[22px] font-bold leading-7 text-ink">Where should we wake you?</Text>
            <Text className="mt-2 text-sm leading-5 text-muted">Search for a destination above. Your selected stop and alert distance will appear here.</Text>
            <View className="mt-4 flex-row items-center rounded-xl bg-cream px-3 py-3"><MapPin size={18} color={colors.rooster} /><Text className="ml-2 text-sm font-semibold text-ink">Cebu City map ready</Text></View>
          </View>
        ) : (
          <View className="absolute inset-x-3 bottom-3 rounded-[24px] border border-line bg-panel p-5 shadow-lg">
            <View className="flex-row items-start">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-red-50"><MapPin size={21} color={colors.rooster} /></View>
              <View className="ml-3 flex-1"><Text className="text-[20px] font-bold leading-6 text-ink">{destination.name}</Text><Text className="mt-1 text-sm leading-5 text-muted">{destination.address}</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel="Save destination" onPress={() => authStatus === 'authenticated' ? saveDestination({ ...destination, label: destination.name, defaultRadius: radius }) : router.push('/(tabs)/saved')} className="-mr-2 -mt-2 h-11 w-11 items-center justify-center rounded-full"><Bookmark size={22} color={isSaved ? colors.rooster : colors.muted} fill={isSaved ? colors.rooster : 'none'} /></Pressable>
            </View>
            <Text className="mb-3 mt-5 text-xs font-bold uppercase tracking-[1.4px] text-muted">Alert distance</Text>
            <View className="flex-row flex-wrap gap-2">{RADII.map((item) => <Chip key={item} selected={radius === item} label={formatDistance(item)} onPress={() => setRadius(item)} />)}</View>
            <AppButton className="mt-5" title="Start preview trip" icon={<Navigation size={19} color="white" />} onPress={begin} />
            <Text className="mt-3 text-center text-[11px] leading-4 text-muted">Web mode previews the flow. Live background alerts require the iPhone app.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function WebMap({ coordinate, title }: { coordinate?: Coordinate; title: string }) {
  const latitude = coordinate?.latitude ?? 10.3157;
  const longitude = coordinate?.longitude ?? 123.8854;
  const latDelta = coordinate ? 0.022 : 0.065;
  const lngDelta = coordinate ? 0.032 : 0.085;
  const bbox = [longitude - lngDelta, latitude - latDelta, longitude + lngDelta, latitude + latDelta].join(',');
  const marker = coordinate ? `&marker=${latitude},${longitude}` : '';
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik${marker}`;
  return createElement('iframe', { key: src, src, title: `${title} map`, loading: 'lazy', referrerPolicy: 'strict-origin-when-cross-origin', style: { width: '100%', height: '100%', minHeight: 560, border: 0, backgroundColor: '#E9E4DA' } });
}
