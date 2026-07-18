import { Module } from '@nitrostack/core';
import { ItineraryTools } from './itinerary.tools.js';
import { ItineraryService } from './itinerary.service.js';
import { DestinationsService } from '../planning/destinations.service.js';

@Module({
  name: 'itinerary',
  description: 'Build and review day-wise group trip itineraries',
  controllers: [ItineraryTools],
  providers: [ItineraryService, DestinationsService],
})
export class ItineraryModule {}
