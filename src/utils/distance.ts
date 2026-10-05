import type { Coordinate } from '@/types';
export function distanceMeters(a: Coordinate, b: Coordinate) {
  const r = 6371e3; const p1 = a.latitude * Math.PI / 180; const p2 = b.latitude * Math.PI / 180;
  const dp = (b.latitude - a.latitude) * Math.PI / 180; const dl = (b.longitude - a.longitude) * Math.PI / 180;
  const h = Math.sin(dp/2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h));
}
export function formatDistance(meters?: number) { if (meters == null) return 'Locating…'; return meters < 1000 ? `${Math.max(0, Math.round(meters))} m` : `${(meters/1000).toFixed(1)} km`; }
