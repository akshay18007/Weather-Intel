import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const windUnit = unit === 'celsius' ? 'km/h' : 'mph';

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!hourly || hourly.length === 0) return null;

  // Find min and max for height scaling or visual aid
  const temps = hourly.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
            24-Hour Forecast Timeline
          </h3>
          <span className="text-xs text-zinc-400 font-normal">
            Next 24 hours
          </span>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
      >
        {hourly.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode, item.isDay);
          const isNow = idx === 0;
          const hasRainRisk = item.precipitationProbability >= 20;

          // Relative bar height for quick visual trend
          const relativeHeight = Math.round(((item.temperature - minTemp) / tempRange) * 20) + 12;

          return (
            <div
              key={`${item.time}-${idx}`}
              className={`shrink-0 w-22 sm:w-24 p-3 rounded-xl flex flex-col items-center justify-between text-center transition-all ${
                isNow
                  ? 'bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80'
                  : 'bg-zinc-50/60 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Time */}
              <span
                className={`text-xs font-semibold ${
                  isNow ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {item.formattedTime}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 text-zinc-700 dark:text-zinc-300">
                <WeatherIcon
                  name={condition.icon}
                  className={`w-6 h-6 ${
                    isNow ? 'text-sky-500 dark:text-sky-400' : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                />
              </div>

              {/* Temperature */}
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {Math.round(item.temperature)}°
              </div>

              {/* Rain Probability Pill */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium">
                {hasRainRisk ? (
                  <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400 font-semibold">
                    <Droplets className="w-3 h-3" />
                    {item.precipitationProbability}%
                  </span>
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500">0%</span>
                )}
              </div>

              {/* Wind speed */}
              <div className="mt-1 text-[10px] text-zinc-400 flex items-center gap-0.5">
                <Wind className="w-2.5 h-2.5" />
                <span>{Math.round(item.windSpeed)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
