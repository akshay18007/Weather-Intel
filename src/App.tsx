import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  CloudSun,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { FullWeatherData, GeoLocation, TemperatureUnit } from './types/weather';
import {
  fetchWeatherData,
  POPULAR_CITIES,
  reverseGeocode,
} from './utils/weatherApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { SevenDayForecast } from './components/SevenDayForecast';
import { PlanningRecommendations } from './components/PlanningRecommendations';

const STORAGE_KEY_UNIT = 'weather_app_unit';
const STORAGE_KEY_LOCATION = 'weather_app_last_location';
const STORAGE_KEY_RECENT = 'weather_app_recent_searches';

export default function App() {
  // State initialization with localStorage fallbacks
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_UNIT);
    return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  });

  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Default to San Francisco
    return POPULAR_CITIES[4];
  });

  const [recentSearches, setRecentSearches] = useState<GeoLocation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[2]];
  });

  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather data for the chosen location and unit
  const loadWeather = useCallback(
    async (location: GeoLocation, tempUnit: TemperatureUnit) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherData(location, tempUnit);
        setWeatherData(data);
        localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
      } catch (err: any) {
        console.error('Failed to load weather data:', err);
        setError(
          err.message || 'Unable to fetch meteorological data from Open-Meteo. Please check your connection and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial fetch and on location/unit change
  useEffect(() => {
    loadWeather(currentLocation, unit);
  }, [currentLocation, unit, loadWeather]);

  // Handle City Selection
  const handleSelectCity = (city: GeoLocation) => {
    setCurrentLocation(city);

    // Update recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id && item.name !== city.name);
      const updated = [city, ...filtered].slice(0, 6);
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
      return updated;
    });
  };

  // Clear Recent Searches
  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY_RECENT);
  };

  // Unit Toggle
  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem(STORAGE_KEY_UNIT, newUnit);
  };

  // GPS Current Location handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const resolvedLoc = await reverseGeocode(lat, lon);
          handleSelectCity(resolvedLoc);
        } catch (e) {
          setError('Failed to resolve address from coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission was denied. You can search your city manually above.');
        } else {
          setError('Unable to acquire GPS coordinates.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-sky-500/20">
      {/* App Header */}
      <Header
        location={currentLocation}
        unit={unit}
        onUnitChange={handleUnitChange}
        onUseCurrentLocation={handleUseCurrentLocation}
        onRefresh={() => loadWeather(currentLocation, unit)}
        isLoading={isLoading}
        isLocating={isLocating}
        lastUpdated={weatherData?.updatedAt}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        {/* City Search Bar & Popular Chips */}
        <section aria-label="City search">
          <SearchBar
            currentLocation={currentLocation}
            onSelectCity={handleSelectCity}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
          />
        </section>

        {/* Error Alert */}
        {error && (
          <div
            id="weather-error-alert"
            className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 text-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Weather Service Notice</p>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadWeather(currentLocation, unit)}
              className="px-3 py-1 bg-white dark:bg-zinc-900 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 hover:bg-rose-50 transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && !weatherData && (
          <div className="space-y-6">
            <div className="h-64 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
              ))}
            </div>
            <div className="h-44 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
            <div className="h-80 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
          </div>
        )}

        {/* Weather Content */}
        {weatherData && (
          <div className="space-y-7">
            {/* 1. Current Weather Card */}
            <section aria-label="Current Weather Conditions">
              <CurrentWeatherCard
                current={weatherData.current}
                todayDaily={weatherData.daily[0]}
                location={weatherData.location}
                unit={unit}
              />
            </section>

            {/* 2. Planning Recommendations (Core Intelligence Feature) */}
            <section aria-label="Planning Recommendations">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Daily Planning Recommendations
                  </h2>
                </div>
                <span className="text-xs text-zinc-400">
                  Custom-tailored to {weatherData.location.name}&apos;s current conditions
                </span>
              </div>
              <PlanningRecommendations recommendations={weatherData.recommendations} />
            </section>

            {/* 3. Hourly Forecast (Next 24 Hours) */}
            <section aria-label="24-Hour Forecast">
              <HourlyForecast hourly={weatherData.hourly} unit={unit} />
            </section>

            {/* 4. Atmospheric Metrics Grid (UV, Wind, Rain, Humidity, Pressure, Sun) */}
            <section aria-label="Atmospheric Metrics Grid">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
                Key Weather Intelligence Metrics
              </h2>
              <WeatherMetricsGrid
                current={weatherData.current}
                todayDaily={weatherData.daily[0]}
                unit={unit}
              />
            </section>

            {/* 5. 7-Day Forecast */}
            <section aria-label="7-Day Extended Forecast">
              <SevenDayForecast daily={weatherData.daily} unit={unit} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Weather Intelligence &bull; Real-time meteorological data sourced directly from Open-Meteo
          </p>
          <div className="flex items-center gap-4">
            <span>No API key required</span>
            <span>&bull;</span>
            <span>Free and open forecast models</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
