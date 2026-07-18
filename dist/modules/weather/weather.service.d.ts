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
 * WeatherService
 *
 * Uses two 100% free, no-key-required Open-Meteo APIs:
 * - Geocoding API → city name → lat/lng/country
 * - Weather Forecast API → current conditions + 7-day forecast
 *
 * Results are cached 15 minutes per city name.
 */
export declare class WeatherService {
    private readonly geocodeBase;
    private readonly weatherBase;
    getWeather(city: string, days?: number): Promise<WeatherResult | null>;
    private geocode;
}
//# sourceMappingURL=weather.service.d.ts.map