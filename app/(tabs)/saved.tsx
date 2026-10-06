import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, Trash2 } from 'lucide-react-native';
import { CluckieMascot } from '@/components/CluckieBrand';
import { AccountRequiredState } from '@/components/AccountRequiredState';
import { colors } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';
import { formatDistance } from '@/utils/distance';

export default function Saved() {
  const saved = useRoostopStore((s) => s.saved);
  const remove = useRoostopStore((s) => s.removeSaved);
  const select = useRoostopStore((s) => s.selectDestination);
  const setRadius = useRoostopStore((s) => s.setAlertRadius);
  const authStatus = useRoostopStore((s) => s.authStatus);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="px-5 pb-5 pt-4">
          <Text className="mt-5 text-[28px] font-bold text-ink">Saved</Text>
        </View>
        {authStatus !== 'authenticated' ? (
          <AccountRequiredState
            mascot="thinking"
            title="Save your favorite stops"
            body="Sign in or create an account to save destinations and access them anytime."
            returnTo="/(tabs)/saved"
          />
        ) : <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-5 pb-20">
              <CluckieMascot variant="sleeping" width={230} height={165} />
              <Text className="mt-4 text-xl font-bold text-ink">No saved stops</Text>
              <Text className="mt-2 max-w-xs text-center text-sm leading-5 text-muted">
                Choose a destination from Home, then save it for quick access next time.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                select(item);
                setRadius(item.defaultRadius);
                router.navigate('/(tabs)');
              }}
              className="mb-3 flex-row items-center rounded-2xl border border-line bg-white p-4"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <MapPin size={23} color={colors.rooster} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-ink">{item.label}</Text>
                <Text className="mt-1 text-sm text-muted">{item.name} · {formatDistance(item.defaultRadius)}</Text>
              </View>
              <Pressable
                accessibilityLabel={`Delete ${item.label}`}
                onPress={() => Alert.alert('Remove saved stop?', item.label, [
                  { text: 'Cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => remove(item.id) },
                ])}
                className="p-2"
              >
                <Trash2 size={20} color={colors.muted} />
              </Pressable>
            </Pressable>
          )}
        />}
      </SafeAreaView>
    </View>
  );
}
