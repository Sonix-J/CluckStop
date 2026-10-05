export type Coordinate = { latitude: number; longitude: number };
export type Destination = { id: string; name: string; address: string; coordinate: Coordinate };
export type SavedDestination = Destination & { label: string; defaultRadius: number };
export type TripStatus = 'idle' | 'active' | 'alarming' | 'completed';
export type Trip = {
  id: string; destination: Destination; startedAt: string; endedAt?: string;
  startCoordinate?: Coordinate; alertRadius: number; alarmTriggered: boolean;
};
export type ThemePreference = 'system' | 'light' | 'dark';
export type AppSettings = { defaultRadius: number; vibration: boolean; sound: boolean; theme: ThemePreference; reducedMotion: boolean };
