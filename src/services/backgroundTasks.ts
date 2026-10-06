import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { distanceMeters } from '@/utils/distance';
import type { Trip } from '@/types';

export const GEOFENCE_TASK = 'ROOSTOP_DESTINATION_GEOFENCE';
export const LOCATION_TASK = 'ROOSTOP_LOCATION_UPDATES';
const ACTIVE_TRIP_KEY = 'cluckie-background-trip';

async function fireDestinationAlarm(trip: Trip, distance?: number) {
  if (trip.alarmTriggered) return;
  await AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify({ ...trip, alarmTriggered: true, alarmDistance: distance }));
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Your stop is near', body: `${trip.destination.name} is approaching. Time to wake up.`, sound: 'default', categoryIdentifier: 'destination-alarm', data: { tripId: trip.id, alarm: true } },
    trigger: null
  });
}

TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const event = data as { eventType: Location.GeofencingEventType; region: Location.LocationRegion };
  if (event.eventType !== Location.GeofencingEventType.Enter) return;
  const raw = await AsyncStorage.getItem(ACTIVE_TRIP_KEY); if (!raw) return;
  await fireDestinationAlarm(JSON.parse(raw) as Trip);
});

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const raw = await AsyncStorage.getItem(ACTIVE_TRIP_KEY); if (!raw) return;
  const trip = JSON.parse(raw) as Trip; const locations = (data as { locations: Location.LocationObject[] }).locations;
  const current = locations.at(-1)?.coords; if (!current) return;
  const distance = distanceMeters({ latitude: current.latitude, longitude: current.longitude }, trip.destination.coordinate);
  if (distance <= trip.alertRadius) await fireDestinationAlarm(trip, distance);
});

export async function configureNotifications() {
  Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
  await Notifications.setNotificationCategoryAsync('destination-alarm', [{ identifier: 'dismiss', buttonTitle: 'I’m awake', options: { opensAppToForeground: true } }]);
  await Notifications.setNotificationChannelAsync('destination-alarms', { name: 'Destination alarms', description: 'Urgent alerts when you approach an active destination.', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 700, 300, 700, 300, 1000], sound: 'default', lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, enableVibrate: true });
}

export async function getPermissionState() {
  const [fg, bg, notifications, servicesEnabled] = await Promise.all([Location.getForegroundPermissionsAsync(), Location.getBackgroundPermissionsAsync(), Notifications.getPermissionsAsync(), Location.hasServicesEnabledAsync()]);
  return { foreground: fg.status, background: bg.status, notifications: notifications.status, servicesEnabled };
}

export async function requestTripPermissions() {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return { ok: false, reason: 'foreground' as const };
  const notifications = await Notifications.requestPermissionsAsync();
  if (notifications.status !== 'granted') return { ok: false, reason: 'notifications' as const };
  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== 'granted') return { ok: false, reason: 'background' as const };
  return { ok: true as const };
}

export async function armTrip(trip: Trip) {
  await AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
  await Location.startGeofencingAsync(GEOFENCE_TASK, [{ identifier: trip.id, ...trip.destination.coordinate, radius: Math.max(100, trip.alertRadius), notifyOnEnter: true, notifyOnExit: false }]);
  await Location.startLocationUpdatesAsync(LOCATION_TASK, { accuracy: Location.Accuracy.Balanced, distanceInterval: 150, deferredUpdatesDistance: 250, deferredUpdatesInterval: 60_000, pausesUpdatesAutomatically: false, showsBackgroundLocationIndicator: true, activityType: Location.ActivityType.OtherNavigation, foregroundService: { notificationTitle: 'Cluckie trip active', notificationBody: `Watching for ${trip.destination.name}`, notificationColor: '#D1263B', killServiceOnDestroy: false } });
}

export async function disarmTrip() {
  if (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK)) await Location.stopGeofencingAsync(GEOFENCE_TASK);
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  await AsyncStorage.removeItem(ACTIVE_TRIP_KEY);
}

export async function readBackgroundTrip() { const raw = await AsyncStorage.getItem(ACTIVE_TRIP_KEY); return raw ? JSON.parse(raw) as Trip & { alarmDistance?: number } : null; }
