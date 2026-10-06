import { FlatList, Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CluckieLogo, CluckieMascot } from '@/components/CluckieBrand';
import { AccountRequiredState } from '@/components/AccountRequiredState';
import { colors } from '@/constants';
import { useRoostopStore } from '@/store/useRoostopStore';
import { formatDistance } from '@/utils/distance';

export default function Trips() {
  const history = useRoostopStore((s) => s.history);
  const authStatus = useRoostopStore((s) => s.authStatus);
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="px-5 pb-4 pt-4">
          <Text className="mt-5 text-[28px] font-bold text-ink">Recent trips</Text>
        </View>
        {authStatus !== 'authenticated' ? (
          <AccountRequiredState
            mascot="login"
            title="Keep track of every ride"
            body="Sign in or create an account to save trips and view your travel history."
            returnTo="/(tabs)/trips"
          />
        ) : <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-5 pb-20">
              <CluckieMascot variant="sleeping" width={230} height={165} />
              <Text className="mt-4 text-xl font-bold text-ink">No trips yet</Text>
              <Text className="mt-2 max-w-xs text-center text-sm leading-5 text-muted">
                Rest easy. Your completed Cluckie trips will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-3 rounded-2xl border border-line bg-white p-4">
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 size={20} color="#16794A" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-bold text-ink">{item.destination.name}</Text>
                  <Text className="mt-1 text-xs text-muted">
                    {new Date(item.startedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </Text>
                </View>
              </View>
              <View className="mt-4 flex-row border-t border-line pt-3">
                <Text className="flex-1 text-sm text-muted">Alert: <Text className="font-semibold text-ink">{formatDistance(item.alertRadius)}</Text></Text>
                <Text className="text-sm font-semibold" style={{ color: item.alarmTriggered ? '#16794A' : colors.muted }}>
                  {item.alarmTriggered ? 'Completed' : 'Stopped early'}
                </Text>
              </View>
            </View>
          )}
        />}
      </SafeAreaView>
    </View>
  );
}
