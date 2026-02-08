import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 60 minutes
const DEFAULT_ZIP = '75110'; // Corsicana, TX

// In-memory cache for weather data
// Key format: "zip:75110" or "coords:32.10,-96.47"
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city: string;
}

function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of weatherCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION_MS) {
      weatherCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zip = searchParams.get('zip');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // Determine cache key and API URL based on params
  let cacheKey: string;
  let apiUrl: string;

  if (zip) {
    // Use zip code (preferred for cost efficiency - one cache per zip)
    cacheKey = `zip:${zip}`;
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  } else if (lat && lon) {
    // Use coordinates (rounded to 2 decimals to group nearby locations)
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }
    cacheKey = `coords:${latNum.toFixed(2)},${lonNum.toFixed(2)}`;
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  } else {
    // Default to Corsicana zip
    cacheKey = `zip:${DEFAULT_ZIP}`;
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${DEFAULT_ZIP},US&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  }

  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json({
      ...cached.data,
      cached: true,
      cacheAge: Math.round((Date.now() - cached.timestamp) / 1000),
    });
  }

  // Clean expired entries periodically
  if (weatherCache.size > 100) {
    cleanExpiredCache();
  }

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: 'Weather API not configured' }, { status: 503 });
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Also use Next.js fetch cache as backup
    });

    if (!response.ok) {
      // If zip code not found, fall back to default
      if (response.status === 404 && zip) {
        const fallbackUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${DEFAULT_ZIP},US&units=imperial&appid=${OPENWEATHER_API_KEY}`;
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          const weatherData: WeatherData = {
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            wind_speed: Math.round(data.wind.speed),
            city: data.name,
          };
          // Cache under default zip
          weatherCache.set(`zip:${DEFAULT_ZIP}`, {
            data: weatherData,
            timestamp: Date.now(),
          });
          return NextResponse.json({ ...weatherData, cached: false, fallback: true });
        }
      }
      throw new Error(`OpenWeather API error: ${response.status}`);
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: Math.round(data.wind.speed),
      city: data.name,
    };

    // Store in cache
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      ...weatherData,
      cached: false,
    });
  } catch (error) {
    console.error('Weather fetch error:', error);

    // Return stale cache if available
    if (cached) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
        stale: true,
        cacheAge: Math.round((Date.now() - cached.timestamp) / 1000),
      });
    }

    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
