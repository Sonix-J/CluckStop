import { Image, type ImageSourcePropType, View } from 'react-native';

const mascotSources = {
  welcome: require('../../Cluckie/Cluckie.png'),
  login: require('../../Cluckie/Cluckie_login_model.png'),
  signup: require('../../Cluckie/Cluckie_signup_model.png'),
  thinking: require('../../Cluckie/Cluckie_forget_model.png'),
  sleeping: require('../../Cluckie/Cluckie_sleeping.png'),
  alarmClock: require('../../Cluckie/Cluckie_alarm_clock.png'),
} satisfies Record<string, ImageSourcePropType>;

export type MascotVariant = keyof typeof mascotSources;

export function CluckieMascot({ variant, width = 240, height = 240 }: { variant: MascotVariant; width?: number; height?: number }) {
  return <Image accessibilityLabel={`Cluckie ${variant} mascot`} source={mascotSources[variant]} resizeMode="contain" style={{ width, height }} />;
}

export function CluckieLogo({ tone = 'red', width = 120 }: { tone?: 'red' | 'white'; width?: number }) {
  const source = tone === 'white' ? require('../../Cluckie/logo_white.png') : require('../../Cluckie/logo_red.png');
  return <View style={{ width, height: width * 0.375, overflow: 'hidden' }}><Image accessibilityLabel="Cluckie logo" source={source} resizeMode="contain" style={{ width, height: width * 0.375 }} /></View>;
}
