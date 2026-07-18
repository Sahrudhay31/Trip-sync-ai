import { Module } from '@nitrostack/core';
import { PlanningTools } from './planning.tools.js';
import { DestinationsService } from './destinations.service.js';
import { PhotoService } from './photo.service.js';

@Module({
  name: 'planning',
  description: 'Collect group trip preferences and recommend the best destination',
  controllers: [PlanningTools],
  providers: [DestinationsService, PhotoService],
})
export class PlanningModule {}
