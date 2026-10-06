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
    q: term,
    format: 'jsonv2',
    addressdetails: '1',
    namedetails: '1',
    limit: '6',
    countrycodes: 'ph',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    signal,
    headers: { Accept: 'application/json', 'Accept-Language': 'en-PH,en;q=0.9' },
  });
  if (!response.ok) throw new Error('Place search is temporarily unavailable.');
  const places = await response.json() as NominatimPlace[];
  return places.map((place) => {
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
}
