'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city?: string;
}

const WEATHER_ICONS: Record<string, any> = {
  '01': Sun,
  '02': Cloud,
  '03': Cloud,
  '04': Cloud,
  '09': CloudRain,
  '10': CloudRain,
  '11': CloudLightning,
  '13': CloudSnow,
  '50': Wind,
};

const DEFAULT_ZIP = '75110'; // Corsicana, TX

interface WeatherWidgetProps {
  zip?: string;
  className?: string;
  variant?: 'compact' | 'full' | 'glass';
  useUserLocation?: boolean;
}

export function WeatherWidget({
  zip,
  className = '',
  variant = 'compact',
  useUserLocation = true
}: WeatherWidgetProps) {
  const { data: session } = useSession();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [displayCity, setDisplayCity] = useState('Corsicana');
  const [hasUserTown, setHasUserTown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userZip, setUserZip] = useState<string | null>(null);

  // Fetch user's zip code from profile if useUserLocation is true
  useEffect(() => {
    if (!useUserLocation || zip) {
      setUserZip(zip || null);
      return;
    }

    const fetchUserLocation = async () => {
      const token = (session?.user as any)?.strapiToken;
      if (!token) {
        setUserZip(null);
        return;
      }

      try {
        const res = await fetch('/api/user/location');
        if (res.ok) {
          const data = await res.json();
          setUserZip(data.zip || null);
          // Use town name from user's preferred town if available
          if (data.town) {
            setDisplayCity(data.town);
            setHasUserTown(true);
          }
        }
      } catch (e) {
        console.error('Failed to fetch user location:', e);
      }
    };

    fetchUserLocation();
  }, [session, useUserLocation, zip]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Use zip code for the API call
        const zipToUse = zip || userZip || DEFAULT_ZIP;
        const res = await fetch(`/api/weather?zip=${zipToUse}`);

        if (!res.ok) {
          throw new Error('Weather fetch failed');
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setWeather({
          temp: data.temp,
          feels_like: data.feels_like,
          humidity: data.humidity,
          description: data.description,
          icon: data.icon,
          wind_speed: data.wind_speed,
        });

        // Use city from API response only if user doesn't have a preferred town
        if (data.city && !hasUserTown) {
          setDisplayCity(data.city);
        }
      } catch (e) {
        setError(true);
      }
      setLoading(false);
    };

    fetchWeather();

    // Check for updates every 30 minutes (the server cache is 60 min,
    // so this gives us 2 checks per cache period in case of stale data)
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [zip, userZip, hasUserTown]);

  if (loading) {
    return (
      <div className={`animate-pulse flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Silently fail - weather is non-essential
  }

  const iconCode = weather.icon.substring(0, 2);
  const WeatherIcon = WEATHER_ICONS[iconCode] || Cloud;

  if (variant === 'compact') {
    return (
      <div className={`group bg-transparent hover:bg-white rounded-xl border border-transparent hover:border-gray-200 cursor-default transition-all duration-300 ease-out hover:shadow-lg ${className}`}>
        {/* Compact state */}
        <div className="flex items-center gap-2 px-3 py-1.5 group-hover:hidden">
          <WeatherIcon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">{weather.temp}°F</span>
        </div>

        {/* Expanded state */}
        <div className="hidden group-hover:block p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">{displayCity}, TX</p>
              <p className="text-3xl font-bold text-gray-900">{weather.temp}°F</p>
            </div>
            <WeatherIcon className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 capitalize mb-3">{weather.description}</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Thermometer className="w-4 h-4" />
              <span>Feels {weather.feels_like}°</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-4 h-4" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4" />
              <span>{weather.wind_speed} mph</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Glass variant - compact pill for hero sections, expands in place on hover
  if (variant === 'glass') {
    return (
      <div className={`group bg-white/20 hover:bg-white backdrop-blur-sm border border-white/40 hover:border-gray-200 rounded-xl cursor-default transition-all duration-300 ease-out hover:shadow-lg ${className}`}>
        {/* Compact state */}
        <div className="flex items-center gap-2 px-4 py-2 group-hover:hidden">
          <WeatherIcon className="w-5 h-5 text-white/90" />
          <span className="text-lg font-semibold text-white">{weather.temp}°F</span>
        </div>

        {/* Expanded state */}
        <div className="hidden group-hover:block p-4 min-w-[220px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">{displayCity}, TX</p>
              <p className="text-3xl font-bold text-gray-900">{weather.temp}°F</p>
            </div>
            <WeatherIcon className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 capitalize mb-3">{weather.description}</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Thermometer className="w-4 h-4" />
              <span>Feels {weather.feels_like}°</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-4 h-4" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4" />
              <span>{weather.wind_speed} mph</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-center ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500">{displayCity}, TX</p>
          <p className="text-3xl font-bold text-gray-900">{weather.temp}°F</p>
        </div>
        <WeatherIcon className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600 capitalize mb-3">{weather.description}</p>
      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4" />
          <span>Feels {weather.feels_like}°</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4" />
          <span>{weather.wind_speed} mph</span>
        </div>
      </div>
    </div>
  );
}
