import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AppSettings, Destination, SavedDestination, Trip, TripStatus } from '@/types';
type State = {
  hydrated: boolean; onboardingComplete: boolean; selectedDestination: Destination | null; alertRadius: number;
  activeTrip: Trip | null; tripStatus: TripStatus; history: Trip[]; saved: SavedDestination[]; alarmDistance?: number; settings: AppSettings;
  setHydrated(v: boolean): void; finishOnboarding(): void; selectDestination(d: Destination | null): void; setAlertRadius(r: number): void;
  startTrip(trip: Trip): void; triggerAlarm(distance?: number): void; dismissAlarm(): void; endTrip(): void;
  saveDestination(d: SavedDestination): void; removeSaved(id: string): void; updateSettings(p: Partial<AppSettings>): void;
};
export const useRoostopStore = create<State>()(persist((set, get) => ({
  hydrated: false, onboardingComplete: false, selectedDestination: null, alertRadius: 500, activeTrip: null, tripStatus: 'idle', history: [], saved: [],
  settings: { defaultRadius: 500, vibration: true, sound: true, theme: 'system', reducedMotion: false },
  setHydrated: hydrated => set({ hydrated }), finishOnboarding: () => set({ onboardingComplete: true }),
  selectDestination: selectedDestination => set({ selectedDestination }), setAlertRadius: alertRadius => set({ alertRadius }),
  startTrip: activeTrip => set({ activeTrip, tripStatus: 'active', selectedDestination: activeTrip.destination }),
  triggerAlarm: alarmDistance => set({ tripStatus: 'alarming', alarmDistance, activeTrip: get().activeTrip ? { ...get().activeTrip!, alarmTriggered: true } : null }),
  dismissAlarm: () => set({ tripStatus: 'active' }),
  endTrip: () => { const trip = get().activeTrip; set({ activeTrip: null, tripStatus: 'idle', selectedDestination: null, history: trip ? [{ ...trip, endedAt: new Date().toISOString() }, ...get().history].slice(0, 50) : get().history }); },
  saveDestination: d => set({ saved: [d, ...get().saved.filter(x => x.id !== d.id)] }), removeSaved: id => set({ saved: get().saved.filter(x => x.id !== id) }),
  updateSettings: p => set({ settings: { ...get().settings, ...p } })
}), { name: 'roostop-storage-v1', storage: createJSONStorage(() => AsyncStorage), partialize: s => ({ onboardingComplete: s.onboardingComplete, alertRadius: s.alertRadius, activeTrip: s.activeTrip, tripStatus: s.tripStatus, history: s.history, saved: s.saved, settings: s.settings }), onRehydrateStorage: () => s => s?.setHydrated(true) }));
