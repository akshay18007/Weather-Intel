export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface GeoLocation {
  id: number | string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  category: 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: string;
  description: string;
  badgeBg: string;
  badgeText: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayLabel: string;
  fullDateLabel: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface PlanningRecommendation {
  overallTone: 'ideal' | 'favorable' | 'moderate' | 'unfavorable';
  headline: string;
  summary: string;
  bestOutdoorWindow: string;
  activityScore: number; // 0 to 100
  activityRating: 'Excellent' | 'Good' | 'Fair' | 'Caution' | 'Stay Indoors';
  outfit: {
    top: string;
    bottom: string;
    outerwear: string;
    footwear: string;
    summary: string;
  };
  essentialsChecklist: Array<{
    id: string;
    item: string;
    status: 'required' | 'recommended' | 'optional' | 'not-needed';
    note: string;
    icon: string;
  }>;
  commute: {
    walking: string;
    cycling: string;
    driving: string;
    roadCondition: string;
  };
  lifestyle: {
    airQualityOrVentilation: string;
    laundryDrying: string;
    hydrationAlert: string;
  };
  sevenDayHighlight: {
    bestDay: string;
    date: string;
    highlight: string;
  };
}

export interface FullWeatherData {
  location: GeoLocation;
  unit: TemperatureUnit;
  elevation: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  recommendations: PlanningRecommendation;
  updatedAt: string;
}
