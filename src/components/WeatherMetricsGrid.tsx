import React from 'react';
import {
  Sun,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Cloud,
  Compass,
  Zap,
} from 'lucide-react';
import { CurrentWeather, DailyForecastItem, TemperatureUnit } from '../types/weather';
import { getUvRiskLevel, getWindDirectionLabel } from '../utils/weatherApi';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  current,
  todayDaily,
  unit,
}) => {
  const uvInfo = getUvRiskLevel(current.uvIndex);
  const windDir = getWindDirectionLabel(current.windDirection);
  const windUnit = unit === 'celsius' ? 'km/h' : 'mph';

  // Estimate dew point from temp and relative humidity
  // Dew Point ~ T - ((100 - RH) / 5)
  const tempC = unit === 'fahrenheit' ? (current.temperature - 32) * (5 / 9) : current.temperature;
  const dewPointC = tempC - (100 - current.relativeHumidity) / 5;
  const dewPointDisplay = unit === 'fahrenheit' ? Math.round((dewPointC * 9) / 5 + 32) : Math.round(dewPointC);
  const tempUnitSymbol = unit === 'celsius' ? '°C' : '°F';

  // Humidity comfort category
  const humidityComfort =
    current.relativeHumidity < 35
      ? 'Dry air — drink extra fluids'
      : current.relativeHumidity <= 65
      ? 'Optimal, comfortable range'
      : current.relativeHumidity <= 80
      ? 'Humid, muggy sensation'
      : 'Extremely damp air';

  // Pressure tendency description
  const pressureCategory =
    current.pressureMsl >= 1020
      ? 'High pressure (Stable & Fair)'
      : current.pressureMsl <= 1005
      ? 'Low pressure (Unsettled)'
      : 'Normal atmospheric balance';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. UV Index */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>UV Index</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${uvInfo.color}`}>
            {uvInfo.label}
          </span>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {current.uvIndex.toFixed(1)}
            <span className="text-xs font-normal text-zinc-400 ml-2">/ 11+</span>
          </div>
          {todayDaily && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Peak today: <span className="font-medium text-zinc-700 dark:text-zinc-300">{todayDaily.uvIndexMax.toFixed(1)}</span>
            </p>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {uvInfo.description}
        </p>
      </div>

      {/* 2. Wind & Gusts */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <Wind className="w-4 h-4 text-teal-500" />
            <span>Wind & Gusts</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span>{windDir} ({current.windDirection}°)</span>
          </div>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {Math.round(current.windSpeed)}
            <span className="text-sm font-normal text-zinc-400 ml-1.5">{windUnit}</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Gusts up to <span className="font-semibold text-zinc-800 dark:text-zinc-200">{Math.round(current.windGusts)} {windUnit}</span>
          </p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {current.windGusts > 35
            ? 'Blustery conditions; secure lightweight outdoor items.'
            : 'Gentle to moderate breeze; negligible wind chill.'}
        </p>
      </div>

      {/* 3. Humidity & Dew Point */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>Relative Humidity</span>
          </div>
          <span className="text-xs text-zinc-400">
            Dew Pt {dewPointDisplay}{tempUnitSymbol}
          </span>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {current.relativeHumidity}%
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {humidityComfort}
          </p>
        </div>
        {/* Progress bar visual */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, Math.max(5, current.relativeHumidity))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Precipitation & Clouds */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <Cloud className="w-4 h-4 text-indigo-500" />
            <span>Cloud & Rain</span>
          </div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {current.cloudCover}% Cover
          </span>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {current.precipitation}
            <span className="text-sm font-normal text-zinc-400 ml-1.5">mm/hr</span>
          </div>
          {todayDaily && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Daily rain chance: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{todayDaily.precipitationProbabilityMax}%</span>
            </p>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {current.precipitation > 0
            ? 'Active precipitation currently observed.'
            : todayDaily && todayDaily.precipitationProbabilityMax > 30
            ? 'Passing showers possible later in the cycle.'
            : 'Precipitation free skies.'}
        </p>
      </div>

      {/* 5. Barometric Pressure */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <Gauge className="w-4 h-4 text-emerald-500" />
            <span>Barometric Pressure</span>
          </div>
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {Math.round(current.pressureMsl)}
            <span className="text-sm font-normal text-zinc-400 ml-1.5">hPa</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {(current.pressureMsl * 0.02953).toFixed(2)} inHg
          </p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {pressureCategory}
        </p>
      </div>

      {/* 6. Sun Cycle (Sunrise & Sunset) */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <Sunrise className="w-4 h-4 text-amber-500" />
            <span>Solar Cycle</span>
          </div>
          <Sunset className="w-4 h-4 text-rose-500" />
        </div>
        <div className="my-3 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium block">Sunrise</span>
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {todayDaily?.sunrise || '06:15 AM'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-medium block">Sunset</span>
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {todayDaily?.sunset || '07:45 PM'}
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {current.isDay ? 'Currently in daylight cycle' : 'Nighttime period'}
        </p>
      </div>
    </div>
  );
};
