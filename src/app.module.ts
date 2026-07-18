import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { PlanningModule } from './modules/planning/planning.module.js';
import { ItineraryModule } from './modules/itinerary/itinerary.module.js';
import { WeatherModule } from './modules/weather/weather.module.js';
import { SystemHealthCheck } from './health/system.health.js';

/**
 * Root Application Module
 *
 * Bootstraps the TripSync AI MCP server and registers all feature modules.
 */
@McpApp({
  module: AppModule,
  server: {
    name: 'tripsync-ai',
    version: '1.0.0'
  },
  logging: {
    level: 'info'
  }
})
@Module({
  name: 'app',
  description: 'TripSync AI — group trip planner MCP server',
  imports: [
    ConfigModule.forRoot(),
    PlanningModule,
    ItineraryModule,
    WeatherModule
  ],
  providers: [
    // Health Checks
    SystemHealthCheck,
  ]
})
export class AppModule {}
