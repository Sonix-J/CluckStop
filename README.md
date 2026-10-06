# Cluckie

Location-based commuter alarm built with Expo, React Native, TypeScript, Expo Router, NativeWind, Zustand, `react-native-maps`, Expo Location, TaskManager, and Notifications.

## Run

```bash
npm install
npx expo prebuild
npx expo run:android   # or: npx expo run:ios
```

Background location does **not** run reliably in Expo Go. Use the included development-build profile (`eas build --profile development`) or a local native build.

## Production checklist

- Replace the curated demo destination search with a Places/Geocoding provider; keep its key in EAS environment variables.
- Add final app icon, adaptive icon foreground, splash assets, and an optional bundled `.wav` alarm sound.
- Complete the Google Play background-location/foreground-service declaration and Apple location-purpose review material.
- Test on physical Android and iOS devices: locked screen, background, tunnel/poor GPS, denied permissions, low-power mode, and OEM battery optimization.
- Never describe alarms as guaranteed. Android force-stop/device-vendor behavior and iOS permissions can prevent delivery.

## Privacy

The MVP has no backend. Saved places, settings, and trip summaries remain in local AsyncStorage. The app does not record or persist a route trail.
