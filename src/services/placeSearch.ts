import { Platform } from 'react-native';
import * as Location from 'expo-location';
import type { Destination } from '@/types';

type NominatimPlace = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  type?: string;
};

function placeName(place: NominatimPlace) {
  return place.name?.trim() || place.display_name.split(',')[0]?.trim() || 'Selected destination';
}

export async function searchRealPlaces(query: string, signal?: AbortSignal): Promise<Destination[]> {
  const term = query.trim();
  if (term.length < 3) return [];
  const params = new URLSearchParams({
    q: `${term}, Cebu, Philippines`,
    format: 'jsonv2',
    addressdetails: '1',
    namedetails: '1',
    limit: '6',
    countrycodes: 'ph',
    viewbox: '123.70,10.50,124.10,10.10',
    bounded: '0',
  });
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      signal,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en-PH,en;q=0.9',
        ...(Platform.OS === 'web' ? {} : { 'User-Agent': 'Cluckie/1.0' }),
      },
    });
    if (!response.ok) throw new Error('Place search is temporarily unavailable.');
    const places = await response.json() as NominatimPlace[];
    const results = places.map((place) => {
      const name = placeName(place);
      const address = place.display_name.startsWith(name)
        ? place.display_name.slice(name.length).replace(/^,\s*/, '')
        : place.display_name;
      return {
        id: `osm-${place.place_id}`,
        name,
        address: address || place.display_name,
        coordinate: { latitude: Number(place.lat), longitude: Number(place.lon) },
      };
    }).filter((place) => Number.isFinite(place.coordinate.latitude) && Number.isFinite(place.coordinate.longitude));
    if (results.length || Platform.OS === 'web') return results;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    if (Platform.OS === 'web') throw error;
  }

  const coordinates = await Location.geocodeAsync(`${term}, Cebu, Philippines`);
  return Promise.all(coordinates.slice(0, 5).map(async (coordinate, index) => {
    const details = await Location.reverseGeocodeAsync(coordinate).catch(() => []);
    const place = details[0];
    const name = place?.name || place?.street || term;
    const address = [place?.street, place?.district, place?.city, place?.region, place?.country]
      .filter(Boolean)
      .filter((part, partIndex, all) => all.indexOf(part) === partIndex)
      .join(', ');
    return {
      id: `native-${coordinate.latitude}-${coordinate.longitude}-${index}`,
      name,
      address: address || term,
      coordinate: { latitude: coordinate.latitude, longitude: coordinate.longitude },
    };
  }));
}
