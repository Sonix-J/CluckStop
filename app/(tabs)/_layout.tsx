import { Tabs } from 'expo-router';
import { Bookmark, Clock3, Map, Settings } from 'lucide-react-native';
import { colors } from '@/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.rooster,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 76,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: colors.panel,
          borderTopColor: colors.line,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: (props) => <Map {...props} size={22} /> }} />
      <Tabs.Screen name="trips" options={{ title: 'Trips', tabBarIcon: (props) => <Clock3 {...props} size={22} /> }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: (props) => <Bookmark {...props} size={22} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: (props) => <Settings {...props} size={22} /> }} />
    </Tabs>
  );
}
