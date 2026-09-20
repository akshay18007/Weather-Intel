import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Umbrella,
  Wind,
  Droplets,
  AlertTriangle,
  Shirt,
  ShieldCheck,
  Bike,
  Car,
  Footprints,
  Sparkles,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'SunMedium':
      return <SunMedium {...props} />;
    case 'MoonStar':
      return <Moon {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind {...props} />;
    case 'CloudSnow':
      return <CloudSnow {...props} />;
    case 'Snowflake':
      return <Snowflake {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'Umbrella':
      return <Umbrella {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Bike':
      return <Bike {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    default:
      return <Cloud {...props} />;
  }
};
