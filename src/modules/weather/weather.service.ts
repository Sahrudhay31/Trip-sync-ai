import { Injectable, Cache } from '@nitrostack/core';

export interface WeatherCurrent {
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  condition: string;
  conditionEmoji: string;
  humidity: number;
  windKph: number;
  uvIndex: number;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  maxTempC: number;
  minTempC: number;
  maxTempF: number;
  minTempF: number;
  condition: string;
  conditionEmoji: string;
  precipitationMm: number;
}

export interface WeatherResult {
  city: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  current: WeatherCurrent;
  forecast: WeatherDay[];
}

/**
 * WMO Weather Interpretation Code → human-readable label + emoji
 * https://open-meteo.com/en/docs#weathervariables
 */
const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Icy fog', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  53: { label: 'Moderate drizzle', emoji: '🌦️' },
  55: { label: 'Dense drizzle', emoji: '🌧️' },
  61: { label: 'Slight rain', emoji: '🌧️' },
  63: { label: 'Moderate rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '🌧️' },
  71: { label: 'Slight snow', emoji: '❄️' },
  73: { label: 'Moderate snow', emoji: '❄️' },
  75: { label: 'Heavy snow', emoji: '🌨️' },
  77: { label: 'Snow grains', emoji: '🌨️' },
  80: { label: 'Slight showers', emoji: '🌦️' },
  81: { label: 'Moderate showers', emoji: '🌧️' },
  82: { label: 'Violent showers', emoji: '⛈️' },
  85: { label: 'Snow showers', emoji: '🌨️' },
  86: { label: 'Heavy snow showers', emoji: '🌨️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm w/ hail', emoji: '⛈️' },
  99: { label: 'Heavy thunderstorm', emoji: '⛈️' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function wmoLabel(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡️' };
}

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * WeatherService
 *
 * Uses two 100% free, no-key-required Open-Meteo APIs:
 * - Geocoding API → city name → lat/lng/country
 * - Weather Forecast API → current conditions + 7-day forecast
 *
 * Results are cached 15 minutes per city name.
 */
@Injectable()
export class WeatherService {
  private readonly geocodeBase = 'https://geocoding-api.open-meteo.com/v1';
  private readonly weatherBase = 'https://api.open-meteo.com/v1';

  @Cache({
    ttl: 900,
    key: (city: any, days?: any) =>
      `weather:${String(city).toLowerCase().replace(/\s+/g, '-')}:${days ?? 7}`,
  })
  async getWeather(city: string, days = 7): Promise<WeatherResult | null> {
    // Step 1: Geocode city name
    const geo = await this.geocode(city);
    if (!geo) return null;

    // Step 2: Fetch current + forecast
    const safeDays = Math.min(Math.max(days, 1), 16);
    const params = new URLSearchParams({
      latitude: geo.lat.toString(),
      longitude: geo.lng.toString(),
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'wind_speed_10m',
        'uv_index',
        'weather_code',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
      ].join(','),
      forecast_days: safeDays.toString(),
      timezone: 'auto',
    });

    const weatherUrl = `${this.weatherBase}/forecast?${params}`;
    const res = await fetch(weatherUrl);
    if (!res.ok) return null;

    const w = (await res.json()) as {
      current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        uv_index: number;
        weather_code: number;
      };
      daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
      };
      timezone: string;
    };

    const cur = w.current;
    const curCode = wmoLabel(cur.weather_code);

    const forecast: WeatherDay[] = (w.daily.time ?? []).map((date, i) => {
      const code = wmoLabel(w.daily.weather_code[i]);
      const d = new Date(date + 'T12:00:00Z');
      return {
        date,
        dayName: DAY_NAMES[d.getUTCDay()],
        maxTempC: Math.round(w.daily.temperature_2m_max[i]),
        minTempC: Math.round(w.daily.temperature_2m_min[i]),
        maxTempF: toF(w.daily.temperature_2m_max[i]),
        minTempF: toF(w.daily.temperature_2m_min[i]),
        condition: code.label,
        conditionEmoji: code.emoji,
        precipitationMm: Math.round(w.daily.precipitation_sum[i] ?? 0),
      };
    });

    return {
      city: geo.name,
      country: geo.country,
      lat: geo.lat,
      lng: geo.lng,
      timezone: w.timezone,
      current: {
        tempC: Math.round(cur.temperature_2m),
        tempF: toF(cur.temperature_2m),
        feelsLikeC: Math.round(cur.apparent_temperature),
        condition: curCode.label,
        conditionEmoji: curCode.emoji,
        humidity: Math.round(cur.relative_humidity_2m),
        windKph: Math.round(cur.wind_speed_10m),
        uvIndex: Math.round(cur.uv_index ?? 0),
      },
      forecast,
    };
  }

  private async geocode(
    city: string
  ): Promise<{ name: string; country: string; lat: number; lng: number } | null> {
    try {
      const url = `${this.geocodeBase}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = (await res.json()) as {
        results?: { name: string; country: string; latitude: number; longitude: number }[];
      };
      if (!json.results || json.results.length === 0) return null;
      const r = json.results[0];
      return { name: r.name, country: r.country, lat: r.latitude, lng: r.longitude };
    } catch {
      return null;
    }
  }
}
