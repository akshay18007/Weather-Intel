import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';
import { getUvRiskLevel } from '../utils/weatherApi';

interface SevenDayForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ daily, unit }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const windUnit = unit === 'celsius' ? 'km/h' : 'mph';

  if (!daily || daily.length === 0) return null;

  // Global min and max across all 7 days for proportional bar visualization
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const totalRange = Math.max(1, weekMax - weekMin);

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
            7-Day Comprehensive Forecast
          </h3>
        </div>
        <span className="text-xs text-zinc-400">
          Click any day for details
        </span>
      </div>

      <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {daily.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode, true);
          const isToday = idx === 0;
          const isExpanded = expandedDate === item.date;
          const uvInfo = getUvRiskLevel(item.uvIndexMax);

          // Bar calculations
          const leftPercent = Math.max(0, ((item.tempMin - weekMin) / totalRange) * 100);
          const widthPercent = Math.max(8, ((item.tempMax - item.tempMin) / totalRange) * 100);

          return (
            <div key={item.date} className="py-3 first:pt-0 last:pb-0">
              {/* Main day row */}
              <button
                onClick={() => toggleExpand(item.date)}
                className={`w-full text-left p-3 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isToday
                    ? 'bg-sky-50/40 dark:bg-sky-950/20 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {/* Day name & date */}
                <div className="flex items-center gap-3 sm:w-44 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                    <WeatherIcon name={condition.icon} className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isToday ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {item.dayLabel}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 block">{item.fullDateLabel}</span>
                  </div>
                </div>

                {/* Weather Condition Label */}
                <div className="flex items-center gap-2 sm:w-36 shrink-0">
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium truncate">
                    {condition.label}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1 sm:w-20 text-xs shrink-0">
                  {item.precipitationProbabilityMax > 0 ? (
                    <span className="flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400">
                      <Droplets className="w-3.5 h-3.5" />
                      {item.precipitationProbabilityMax}%
                    </span>
                  ) : (
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 opacity-40" />
                      0%
                    </span>
                  )}
                </div>

                {/* Temperature Range Bar */}
                <div className="flex items-center gap-3 flex-1 min-w-[160px] sm:max-w-xs">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 w-7 text-right">
                    {Math.round(item.tempMin)}°
                  </span>

                  {/* Range visual bar */}
                  <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 opacity-90"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 w-7">
                    {Math.round(item.tempMax)}°
                  </span>
                </div>

                {/* Toggle chevron */}
                <div className="text-zinc-400 pl-1 hidden sm:block">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="mt-2 mx-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Atmospheric Summary</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {condition.description}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block mb-0.5">Precipitation & Rain</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {item.precipitationSum > 0 ? `${item.precipitationSum} mm total rainfall` : 'Zero rainfall expected'}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block mb-0.5">Wind & Sun Exposure</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-teal-500" />
                      Peak {Math.round(item.windSpeedMax)} {windUnit} • UV {item.uvIndexMax.toFixed(1)} ({uvInfo.label})
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block mb-0.5">Sun Schedule</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-amber-600">
                        <Sunrise className="w-3 h-3" /> {item.sunrise}
                      </span>
                      <span className="flex items-center gap-1 text-rose-600">
                        <Sunset className="w-3 h-3" /> {item.sunset}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
