import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Clock, Loader2 } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { POPULAR_CITIES, searchCities } from '../utils/weatherApi';

interface SearchBarProps {
  currentLocation: GeoLocation | null;
  onSelectCity: (city: GeoLocation) => void;
  recentSearches: GeoLocation[];
  onClearRecent: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentLocation,
  onSelectCity,
  recentSearches,
  onClearRecent,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      const cities = await searchCities(query);
      setResults(cities);
      setIsSearching(false);
      setIsOpen(true);
      setHighlightedIndex(-1);
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const itemsCount = results.length > 0 ? results.length : recentSearches.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % itemsCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? itemsCount - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        if (results.length > 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        } else if (recentSearches.length > 0 && recentSearches[highlightedIndex]) {
          handleSelect(recentSearches[highlightedIndex]);
        }
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-zinc-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any city or region (e.g. Kyoto, Seattle, Oslo)..."
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all shadow-xs"
          />
          {query && (
            <button
              id="clear-search-btn"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching global Open-Meteo database...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="py-1.5">
                <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Search Results
                </div>
                {results.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                      highlightedIndex === idx
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-100'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.country_code && (
                          <span className="text-[11px] font-normal px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase">
                            {item.country_code}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No matching cities found for &quot;{query}&quot;. Try another spelling.
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="py-1.5">
                <div className="px-3 py-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  <span>Recent Searches</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearRecent();
                    }}
                    className="hover:text-zinc-600 dark:hover:text-zinc-300 normal-case text-xs font-normal"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((item, idx) => (
                  <button
                    key={`recent-${item.id}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                      highlightedIndex === idx
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-100'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-zinc-400 truncate">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-zinc-400">
                Type at least 2 characters to search worldwide locations.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick selection popular cities chips */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-zinc-400 shrink-0 text-[11px] font-medium mr-1">Popular:</span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentLocation?.name === city.name;
          return (
            <button
              key={city.name}
              id={`popular-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleSelect(city)}
              className={`shrink-0 px-2.5 py-1 rounded-lg font-medium transition-colors border ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300'
                  : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
