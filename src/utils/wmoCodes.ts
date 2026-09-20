import { WeatherConditionInfo } from '../types/weather';

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Sunny' : 'Clear Sky',
        category: 'clear',
        icon: isDay ? 'Sun' : 'Moon',
        description: isDay ? 'Bright sunshine with clear blue skies.' : 'Clear starry skies with zero cloud cover.',
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/40',
        badgeText: 'Clear',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mostly Sunny' : 'Mostly Clear',
        category: 'clear',
        icon: isDay ? 'SunMedium' : 'MoonStar',
        description: 'Pleasantly clear with isolated faint cloud patches.',
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/40',
        badgeText: 'Mostly Clear',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        category: 'partly-cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        description: 'Scattered clouds filtering gentle sunlight throughout the day.',
        badgeBg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700/40',
        badgeText: 'Partly Cloudy',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        category: 'cloudy',
        icon: 'Cloud',
        description: 'Full blanket cloud deck with diffuse muted lighting.',
        badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/40',
        badgeText: 'Overcast',
      };
    case 45:
    case 48:
      return {
        code,
        label: 'Foggy / Hazy',
        category: 'fog',
        icon: 'CloudFog',
        description: 'Low-lying mist or fog banks reducing horizontal visibility.',
        badgeBg: 'bg-zinc-500/10 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/40',
        badgeText: 'Fog & Mist',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        category: 'drizzle',
        icon: 'CloudDrizzle',
        description: 'Gentle misty drizzle falling periodically.',
        badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/40',
        badgeText: 'Light Drizzle',
      };
    case 53:
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        category: 'drizzle',
        icon: 'CloudDrizzle',
        description: 'Consistent steady drizzle dampening pavements.',
        badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/40',
        badgeText: 'Dense Drizzle',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        category: 'drizzle',
        icon: 'CloudSnow',
        description: 'Cold drizzle creating black ice or slick road glazes.',
        badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40',
        badgeText: 'Freezing Drizzle',
      };
    case 61:
      return {
        code,
        label: 'Light Rain',
        category: 'rain',
        icon: 'CloudRain',
        description: 'Gentle rain showers with occasional damp spells.',
        badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/40',
        badgeText: 'Light Rain',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        category: 'rain',
        icon: 'CloudRain',
        description: 'Steady rainfall with pooling puddles and wet streets.',
        badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/40',
        badgeText: 'Moderate Rain',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        category: 'rain',
        icon: 'CloudRainWind',
        description: 'Substantial downpour with water runoff and low visibility.',
        badgeBg: 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700/40',
        badgeText: 'Heavy Rain',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        category: 'rain',
        icon: 'CloudSnow',
        description: 'Dangerous sub-freezing rain icing surfaces quickly.',
        badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40',
        badgeText: 'Freezing Rain',
      };
    case 71:
      return {
        code,
        label: 'Light Snow',
        category: 'snow',
        icon: 'Snowflake',
        description: 'Delicate flurries drifting through crisp sub-zero air.',
        badgeBg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700/40',
        badgeText: 'Light Snow',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        category: 'snow',
        icon: 'CloudSnow',
        description: 'Active snowfall creating accumulating ground dusting.',
        badgeBg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700/40',
        badgeText: 'Moderate Snow',
      };
    case 75:
    case 77:
      return {
        code,
        label: 'Heavy Snow',
        category: 'snow',
        icon: 'Snowflake',
        description: 'Blizzard-like dense snowfall significantly reducing visibility.',
        badgeBg: 'bg-teal-600/10 dark:bg-teal-600/20 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700/40',
        badgeText: 'Heavy Snow',
      };
    case 80:
    case 81:
      return {
        code,
        label: 'Rain Showers',
        category: 'rain',
        icon: 'CloudRain',
        description: 'Intermittent passing showers alternating with breaks.',
        badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/40',
        badgeText: 'Rain Showers',
      };
    case 82:
      return {
        code,
        label: 'Violent Showers',
        category: 'rain',
        icon: 'CloudRainWind',
        description: 'Intense torrential rainfall bursts with gusty winds.',
        badgeBg: 'bg-blue-700/10 dark:bg-blue-700/20 text-blue-900 dark:text-blue-200 border-blue-400 dark:border-blue-700/40',
        badgeText: 'Violent Showers',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        category: 'snow',
        icon: 'CloudSnow',
        description: 'Burst of snow squalls with sudden whiteout moments.',
        badgeBg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700/40',
        badgeText: 'Snow Showers',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        category: 'thunderstorm',
        icon: 'CloudLightning',
        description: 'Electric storm activity with thunderclaps and lightning.',
        badgeBg: 'bg-amber-600/10 dark:bg-amber-600/20 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700/40',
        badgeText: 'Thunderstorm',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm & Hail',
        category: 'thunderstorm',
        icon: 'CloudLightning',
        description: 'Violent storm cells producing hail stones and turbulent gusts.',
        badgeBg: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/40',
        badgeText: 'Severe Storm & Hail',
      };
    default:
      return {
        code,
        label: 'Variable',
        category: 'cloudy',
        icon: 'Cloud',
        description: 'Typical atmospheric conditions.',
        badgeBg: 'bg-zinc-500/10 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/40',
        badgeText: 'Variable',
      };
  }
}
