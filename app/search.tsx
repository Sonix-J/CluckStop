import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { Screen, SearchBox } from '@/components/ui';
import { colors } from '@/constants';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { useRoostopStore } from '@/store/useRoostopStore';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const select = useRoostopStore((state) => state.selectDestination);
  const { results, loading, error } = usePlaceSearch(query);
  const helper = query.trim().length < 3 ? 'Enter at least 3 characters to search real places.' : error;

  return (
    <Screen className="bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center gap-2 px-4 py-3">
          <Pressable accessibilityLabel="Close search" onPress={() => router.back()} className="h-12 w-12 items-center justify-center">
            <ChevronLeft size={26} color={colors.ink} />
          </Pressable>
          <View className="flex-1 rounded-app bg-white shadow-lg">
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
          ListEmptyComponent={!loading ? <Text className="px-8 py-12 text-center text-sm leading-5 text-muted">{helper || 'No matching places found. Try a more specific name or address.'}</Text> : null}
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
    </Screen>
  );
}
