import { ExecutionContext, z } from '@nitrostack/core';
import { WeatherService } from './weather.service.js';
declare const weatherInputSchema: z.ZodObject<{
    destination: z.ZodString;
    days: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    days: number;
    destination: string;
}, {
    destination: string;
    days?: number | undefined;
}>;
export declare class WeatherTools {
    private weatherService;
    constructor(weatherService: WeatherService);
    getDestinationWeather(input: z.infer<typeof weatherInputSchema>, ctx: ExecutionContext): Promise<{
        found: boolean;
        destination: string;
        message: string;
        current: null;
        forecast: never[];
        city?: undefined;
        country?: undefined;
        lat?: undefined;
        lng?: undefined;
        timezone?: undefined;
    } | {
        found: boolean;
        city: string;
        country: string;
        lat: number;
        lng: number;
        timezone: string;
        current: import("./weather.service.js").WeatherCurrent;
        forecast: import("./weather.service.js").WeatherDay[];
        destination?: undefined;
        message?: undefined;
    }>;
}
export {};
//# sourceMappingURL=weather.tools.d.ts.map