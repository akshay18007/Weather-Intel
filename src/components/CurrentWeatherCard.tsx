import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Droplets, Wind, Sun, Clock } from 'lucide-react';
import { CurrentWeather, DailyForecastItem, GeoLocation, TemperatureUnit } from '../types/weather';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';
import { getUvRiskLevel } from '../utils/weatherApi';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  location: GeoLocation;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  todayDaily,
  location,
  unit,
}) => {
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const uvInfo = getUvRiskLevel(current.uvIndex);
  const tempUnitSymbol = unit === 'celsius' ? '°C' : '°F';
  const windUnit = unit === 'celsius' ? 'km/h' : 'mph';

  // Format observation time
  const observationTime = (() => {
    try {
      const d = new Date(current.time);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  })();

  const tempDiff = Math.round(current.apparentTemperature - current.temperature);
  const feelsLikeDescription =
    tempDiff === 0
      ? 'Matches ambient thermometer'
      : tempDiff > 0
      ? `Feels ${tempDiff}° warmer with humidity`
      : `Feels ${Math.abs(tempDiff)}° cooler with wind`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-sky-500/5 dark:bg-sky-400/5 blur-3xl pointer-events-none" />

      {/* Top row: Location & Observation time */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {location.name}
              </h2>
              {location.country_code && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {location.country_code}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {[location.admin1, location.country].filter(Boolean).join(', ')} • {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-start">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${condition.badgeBg}`}>
            {condition.label}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Observed {observationTime}
          </span>
        </div>
      </div>

      {/* Main Temperature & Weather Visuals */}
      <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Weather Icon Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center text-sky-500 dark:text-sky-400 shadow-inner shrink-0">
            <WeatherIcon name={condition.icon} className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>

          <div>
            {/* Large Temperature Display */}
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
                {Math.round(current.temperature)}
              </span>
              <span className="text-2xl sm:text-3xl font-medium text-zinc-400 dark:text-zinc-500 ml-1">
                {tempUnitSymbol}
              </span>
            </div>

            {/* Feels like and condition description */}
            <div className="mt-1 flex flex-col gap-0.5">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Feels like {Math.round(current.apparentTemperature)}{tempUnitSymbol}
                <span className="text-xs text-zinc-400 ml-1.5 font-normal">({feelsLikeDescription})</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {condition.description}
              </p>
            </div>
          </div>
        </div>

        {/* High / Low & Quick Stats */}
        {todayDaily && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 min-w-[240px]">
            {/* High / Low pill */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Today&apos;s Range</span>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <span className="flex items-center text-rose-600 dark:text-rose-400">
                  <ArrowUp className="w-3.5 h-3.5" />
                  {Math.round(todayDaily.tempMax)}°
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
                <span className="flex items-center text-sky-600 dark:text-sky-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                  {Math.round(todayDaily.tempMin)}°
                </span>
              </div>
            </div>

            {/* Precipitation pill */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Rain Chance</span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>{todayDaily.precipitationProbabilityMax}%</span>
                {todayDaily.precipitationSum > 0 && (
                  <span className="text-xs text-zinc-400 font-normal">({todayDaily.precipitationSum}mm)</span>
                )}
              </div>
            </div>

            {/* Wind pill */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Current Wind</span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                <span>{Math.round(current.windSpeed)} {windUnit}</span>
              </div>
            </div>

            {/* UV pill */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">UV Exposure</span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{current.uvIndex.toFixed(1)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${uvInfo.color}`}>
                  {uvInfo.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
