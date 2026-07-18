var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Widget, Injectable, z } from '@nitrostack/core';
import { WeatherService } from './weather.service.js';
const weatherInputSchema = z.object({
    destination: z
        .string()
        .describe('The city or destination name to get weather for, e.g. "Bali" or "Santorini"'),
    days: z
        .number()
        .int()
        .min(1)
        .max(14)
        .optional()
        .default(7)
        .describe('Number of forecast days to return (1–14). Defaults to 7.'),
});
let WeatherTools = class WeatherTools {
    weatherService;
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    async getDestinationWeather(input, ctx) {
        ctx.logger.info('Fetching weather', { destination: input.destination, days: input.days });
        const result = await this.weatherService.getWeather(input.destination, input.days ?? 7);
        if (!result) {
            return {
                found: false,
                destination: input.destination,
                message: `Could not find weather data for "${input.destination}". Try a major city name like "Bali", "Paris", or "Maldives".`,
                current: null,
                forecast: [],
            };
        }
        return {
            found: true,
            city: result.city,
            country: result.country,
            lat: result.lat,
            lng: result.lng,
            timezone: result.timezone,
            current: result.current,
            forecast: result.forecast,
        };
    }
};
__decorate([
    Tool({
        name: 'get-destination-weather',
        description: 'Get live current weather conditions and a multi-day forecast for a travel destination. ' +
            'Use this after recommending a destination to give the group real-time weather context for trip planning. ' +
            'Renders a weather panel widget with temperature, humidity, UV index, wind speed, and daily forecast.',
        inputSchema: weatherInputSchema,
    }),
    Widget('weather-panel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0, Object]),
    __metadata("design:returntype", Promise)
], WeatherTools.prototype, "getDestinationWeather", null);
WeatherTools = __decorate([
    Injectable({ deps: [WeatherService] }),
    __metadata("design:paramtypes", [WeatherService])
], WeatherTools);
export { WeatherTools };
//# sourceMappingURL=weather.tools.js.map