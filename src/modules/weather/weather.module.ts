import { Module } from '@nitrostack/core';
import { WeatherService } from './weather.service.js';
import { WeatherTools } from './weather.tools.js';

@Module({
  name: 'weather',
  description: 'Live weather conditions and forecasts for trip destinations via Open-Meteo',
  controllers: [WeatherTools],
  providers: [WeatherService],
})
export class WeatherModule {}
