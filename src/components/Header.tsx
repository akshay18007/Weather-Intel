import React from 'react';
import { CloudSun, Locate, RefreshCw, Compass } from 'lucide-react';
import { GeoLocation, TemperatureUnit } from '../types/weather';

interface HeaderProps {
  location: GeoLocation | null;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  onUseCurrentLocation: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isLocating: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  unit,
  onUnitChange,
  onUseCurrentLocation,
  onRefresh,
  isLoading,
  isLocating,
  lastUpdated,
}) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 shrink-0">
            <CloudSun className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2 truncate">
              Weather Intelligence
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1.5">
              <span>Powered by Open-Meteo</span>
              {lastUpdated && (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-zinc-400"></span>
                  <span>Synced {formatTime(lastUpdated)}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Location button */}
          <button
            id="gps-location-btn"
            onClick={onUseCurrentLocation}
            disabled={isLocating || isLoading}
            title="Use current GPS location"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-500' : 'text-zinc-500 dark:text-zinc-400'}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* Refresh button */}
          <button
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh forecast data"
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Unit Toggle */}
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
            <button
              id="unit-celsius-btn"
              onClick={() => onUnitChange('celsius')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                unit === 'celsius'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              onClick={() => onUnitChange('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
