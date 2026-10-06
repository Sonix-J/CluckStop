import { useEffect, useState } from 'react';
import type { Destination } from '@/types';
import { searchRealPlaces } from '@/services/placeSearch';

export function usePlaceSearch(query: string) {
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const term = query.trim();
    if (term.length < 3) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      void searchRealPlaces(term, controller.signal)
        .then(setResults)
        .catch((reason: unknown) => {
          if (reason instanceof Error && reason.name === 'AbortError') return;
          setResults([]);
          setError('We couldn’t search places right now. Check your connection and try again.');
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 650);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const hasSearchTerm = query.trim().length >= 3;
  return {
    results: hasSearchTerm ? results : [],
    loading: hasSearchTerm ? loading : false,
    error: hasSearchTerm ? error : '',
  };
}
