import { ToolDecorator as Tool, Widget, Injectable, ExecutionContext, z } from '@nitrostack/core';
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

@Injectable({ deps: [WeatherService] })
export class WeatherTools {
  constructor(private weatherService: WeatherService) {}

  @Tool({
    name: 'get-destination-weather',
    description:
      'Get live current weather conditions and a multi-day forecast for a travel destination. ' +
      'Use this after recommending a destination to give the group real-time weather context for trip planning. ' +
      'Renders a weather panel widget with temperature, humidity, UV index, wind speed, and daily forecast.',
    inputSchema: weatherInputSchema,
  })
  @Widget('weather-panel')
  async getDestinationWeather(
    input: z.infer<typeof weatherInputSchema>,
    ctx: ExecutionContext
  ) {
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
}
