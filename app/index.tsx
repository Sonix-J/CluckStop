import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CluckieLogo } from '@/components/CluckieBrand';

export default function SplashScreen() {
  useEffect(() => { const timer = setTimeout(() => router.replace('/welcome'), 1100); return () => clearTimeout(timer); }, []);
  return <View className="flex-1 items-center justify-center bg-rooster"><StatusBar style="light"/><CluckieLogo tone="white" width={220}/></View>;
}
