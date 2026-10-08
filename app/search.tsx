import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { SearchBox } from '@/components/ui';
import { colors } from '@/constants';
import { CluckieMascot } from '@/components/CluckieBrand';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const select = useRoostopStore((state) => state.selectDestination);
  const { results, loading, error } = usePlaceSearch(query);
  const helper = query.trim().length < 3 ? 'Enter at least 3 characters to search real places.' : error;

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
        <View className="flex-row items-center gap-2 px-4 py-3">
          <Pressable accessibilityLabel="Close search" onPress={() => router.back()} className="h-12 w-12 items-center justify-center">
            <ChevronLeft size={26} color={colors.ink} />
          </Pressable>
          <View className="flex-1 rounded-app border border-line bg-white">
            <SearchBox autoFocus value={query} onChangeText={setQuery} placeholder="Search destinations" returnKeyType="search" />
          </View>
        </View>
        <View className="flex-row items-center px-5 pb-2 pt-4">
          <Text className="flex-1 text-sm font-bold uppercase tracking-wider text-muted">Search results</Text>
          {loading && <ActivityIndicator size="small" color={colors.rooster} />}
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={!loading ? (
            <View className="items-center px-8 pt-16">
              <CluckieMascot
                variant={query.trim().length < 3 ? 'login' : 'thinking'}
                width={190}
                height={165}
              />
              <Text className="mt-5 text-center text-xl font-bold text-ink">
                {query.trim().length < 3 ? 'Where are we heading?' : 'No places found'}
              </Text>
              <Text className="mt-2 max-w-xs text-center text-sm leading-5 text-muted">
                {query.trim().length < 3
                  ? 'Search for a destination, landmark, street, or address.'
                  : helper || 'Try a more specific place name or include the city.'}
              </Text>
            </View>
          ) : null}
          renderItem={({ item }) => (
            <Pressable
              className="mx-4 flex-row items-center border-b border-line py-4"
              onPress={() => { select(item); router.back(); }}
            >
              <MapPin size={21} color={colors.rooster} />
              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-ink">{item.name}</Text>
                <Text className="mt-1 text-sm leading-5 text-muted" numberOfLines={2}>{item.address}</Text>
              </View>
            </Pressable>
          )}
        />
        <Text className="px-5 pb-5 text-center text-[11px] text-muted">Place data © OpenStreetMap contributors</Text>
      </SafeAreaView>
    </View>
  );
}
