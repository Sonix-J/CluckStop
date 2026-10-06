import type { Destination } from '@/types';
export const colors = { cream: '#FFF6EE', panel: '#FFFFFF', ink: '#1F1C1A', muted: '#716A64', rooster: '#D1263B', roosterDark: '#AA1D30', yolk: '#F4B223', line: '#E1D8CF', night: '#171513', white: '#FFFFFF', softPrimary: '#FFE8DD' };
export const CEBU_REGION = { latitude: 10.3157, longitude: 123.8854, latitudeDelta: 0.08, longitudeDelta: 0.08 };
export const SAMPLE_DESTINATIONS: Destination[] = [
  { id: 'ayala', name: 'Ayala Center Cebu', address: 'Cebu Business Park, Cebu City', coordinate: { latitude: 10.3181, longitude: 123.9032 } },
  { id: 'it-park', name: 'Cebu IT Park', address: 'Lahug, Cebu City', coordinate: { latitude: 10.3308, longitude: 123.9067 } },
  { id: 'sm-city', name: 'SM City Cebu', address: 'North Reclamation Area, Cebu City', coordinate: { latitude: 10.3119, longitude: 123.9183 } },
  { id: 'south-bus', name: 'Cebu South Bus Terminal', address: 'N. Bacalso Avenue, Cebu City', coordinate: { latitude: 10.2987, longitude: 123.8936 } }
];
export const RADII = [250, 500, 1000, 2000];
