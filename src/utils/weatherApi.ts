import { CurrentWeather, DailyForecastItem, FullWeatherData, GeoLocation, HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { generatePlanningRecommendations } from './recommendations';

export const POPULAR_CITIES: GeoLocation[] = [
  { id: 1850147, name: 'Tokyo', country: 'Japan', country_code: 'JP', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  { id: 5128581, name: 'New York', country: 'United States', country_code: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.006 },
  { id: 2643743, name: 'London', country: 'United Kingdom', country_code: 'GB', admin1: 'England', latitude: 51.5085, longitude: -0.1257 },
  { id: 2988507, name: 'Paris', country: 'France', country_code: 'FR', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488 },
  { id: 5391959, name: 'San Francisco', country: 'United States', country_code: 'US', admin1: 'California', latitude: 37.7749, longitude: -122.4194 },
  { id: 2147714, name: 'Sydney', country: 'Australia', country_code: 'AU', admin1: 'New South Wales', latitude: -33.8678, longitude: 151.2073 },
  { id: 1275339, name: 'Mumbai', country: 'India', country_code: 'IN', admin1: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
  { id: 1880252, name: 'Singapore', country: 'Singapore', country_code: 'SG', admin1: 'Central Singapore', latitude: 1.2897, longitude: 103.8501 },
];

export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to search cities: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  // Try Open-Meteo or BigDataCloud / open geocode fallback
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      return {
        id: `loc-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
        latitude,
        longitude,
      };
    }
  } catch (e) {
    // Fallback if network blocked
  }

  return {
    id: `coord-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
    name: `Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
    latitude,
    longitude,
  };
}

export async function fetchWeatherData(
  location: GeoLocation,
  unit: TemperatureUnit = 'celsius'
): Promise<FullWeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    temperature_unit: unit,
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    timeformat: 'iso8601',
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();

  // Parse Current Weather
  const current: CurrentWeather = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    apparentTemperature: raw.current.apparent_temperature,
    relativeHumidity: raw.current.relative_humidity_2m,
    isDay: raw.current.is_day === 1,
    precipitation: raw.current.precipitation ?? 0,
    rain: raw.current.rain ?? 0,
    weatherCode: raw.current.weather_code,
    cloudCover: raw.current.cloud_cover ?? 0,
    pressureMsl: raw.current.pressure_msl ?? 1013,
    windSpeed: raw.current.wind_speed_10m ?? 0,
    windDirection: raw.current.wind_direction_10m ?? 0,
    windGusts: raw.current.wind_gusts_10m ?? raw.current.wind_speed_10m,
    uvIndex: raw.current.uv_index ?? 0,
  };

  // Parse Hourly Forecast (filter to next 24 hours starting from current time)
  const now = new Date(raw.current.time || new Date().toISOString());
  const nowTimestamp = now.getTime();

  const hourly: HourlyForecastItem[] = [];
  const times: string[] = raw.hourly?.time || [];
  const temps: number[] = raw.hourly?.temperature_2m || [];
  const rainProbs: number[] = raw.hourly?.precipitation_probability || [];
  const codes: number[] = raw.hourly?.weather_code || [];
  const windSpeeds: number[] = raw.hourly?.wind_speed_10m || [];
  const uvs: number[] = raw.hourly?.uv_index || [];
  const isDays: number[] = raw.hourly?.is_day || [];

  let startIndex = 0;
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    if (t >= nowTimestamp - 3600000) {
      startIndex = i;
      break;
    }
  }

  const endIndex = Math.min(startIndex + 24, times.length);

  for (let i = startIndex; i < endIndex; i++) {
    const itemDate = new Date(times[i]);
    const hours = itemDate.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 === 0 ? '12' : (hours % 12).toString();
    const formattedTime = i === startIndex ? 'Now' : `${formattedHour} ${ampm}`;

    hourly.push({
      time: times[i],
      formattedTime,
      temperature: temps[i] ?? 0,
      precipitationProbability: rainProbs[i] ?? 0,
      weatherCode: codes[i] ?? 0,
      windSpeed: windSpeeds[i] ?? 0,
      uvIndex: uvs[i] ?? 0,
      isDay: isDays[i] === 1,
    });
  }

  // Parse Daily Forecast (7 Days)
  const daily: DailyForecastItem[] = [];
  const dailyDates: string[] = raw.daily?.time || [];
  const dailyCodes: number[] = raw.daily?.weather_code || [];
  const maxTemps: number[] = raw.daily?.temperature_2m_max || [];
  const minTemps: number[] = raw.daily?.temperature_2m_min || [];
  const appMaxTemps: number[] = raw.daily?.apparent_temperature_max || [];
  const appMinTemps: number[] = raw.daily?.apparent_temperature_min || [];
  const precipSums: number[] = raw.daily?.precipitation_sum || [];
  const precipProbs: number[] = raw.daily?.precipitation_probability_max || [];
  const maxWinds: number[] = raw.daily?.wind_speed_10m_max || [];
  const maxUvs: number[] = raw.daily?.uv_index_max || [];
  const sunrises: string[] = raw.daily?.sunrise || [];
  const sunsets: string[] = raw.daily?.sunset || [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
    const d = new Date(dailyDates[i] + 'T12:00:00');
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()];
    const fullDateLabel = `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;

    daily.push({
      date: dailyDates[i],
      dayLabel,
      fullDateLabel,
      weatherCode: dailyCodes[i] ?? 0,
      tempMax: maxTemps[i] ?? 0,
      tempMin: minTemps[i] ?? 0,
      apparentTempMax: appMaxTemps[i] ?? maxTemps[i] ?? 0,
      apparentTempMin: appMinMinTemps(minTemps, appMinTemps, i),
      precipitationSum: precipSums[i] ?? 0,
      precipitationProbabilityMax: precipProbs[i] ?? 0,
      windSpeedMax: maxWinds[i] ?? 0,
      uvIndexMax: maxUvs[i] ?? 0,
      sunrise: sunrises[i] ? formatTimeStr(sunrises[i]) : '06:00 AM',
      sunset: sunsets[i] ? formatTimeStr(sunsets[i]) : '07:30 PM',
    });
  }

  // Generate intelligent planning recommendations
  const recommendations = generatePlanningRecommendations(current, hourly, daily, unit);

  return {
    location,
    unit,
    elevation: raw.elevation ?? 0,
    timezone: raw.timezone ?? 'UTC',
    current,
    hourly,
    daily,
    recommendations,
    updatedAt: new Date().toISOString(),
  };
}

function appMinMinTemps(minTemps: number[], appMinTemps: number[], i: number): number {
  return appMinTemps[i] ?? minTemps[i] ?? 0;
}

function formatTimeStr(isoString: string): string {
  try {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return isoString.split('T')[1]?.slice(0, 5) || isoString;
  }
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvRiskLevel(uv: number): { label: string; color: string; description: string } {
  if (uv >= 11) return { label: 'Extreme', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-200 dark:border-purple-800', description: 'Avoid outdoor sun exposure' };
  if (uv >= 8) return { label: 'Very High', color: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-200 dark:border-red-800', description: 'Sun protection essential' };
  if (uv >= 6) return { label: 'High', color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-200 dark:border-orange-800', description: 'Wear hat & SPF 30+' };
  if (uv >= 3) return { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-200 dark:border-amber-800', description: 'Seek shade during midday' };
  return { label: 'Low', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800', description: 'Minimal solar danger' };
}
