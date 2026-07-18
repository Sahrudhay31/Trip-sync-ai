import { ToolDecorator as Tool, Widget, Injectable, ExecutionContext, z } from '@nitrostack/core';
import { ItineraryService } from './itinerary.service.js';

const generateInputSchema = z.object({
  destination: z
    .string()
    .describe('The destination name or id to build the itinerary for, e.g. "Bali"'),
  days: z.number().int().positive().describe('Number of days for the itinerary'),
});

const getDayInputSchema = z.object({
  dayId: z
    .string()
    .describe('The day id from an itinerary, format "<destinationId>-day-<n>", e.g. "bali-day-3"'),
});

@Injectable({ deps: [ItineraryService] })
export class ItineraryTools {
  constructor(private itineraryService: ItineraryService) {}

  @Tool({
    name: 'generate-itinerary',
    description:
      'Generate a day-wise travel itinerary for a destination. Each day includes places to visit, activities, food suggestions, and an estimated budget. Renders an itinerary day card grid.',
    inputSchema: generateInputSchema,
  })
  @Widget('itinerary-days')
  async generateItinerary(
    input: z.infer<typeof generateInputSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Generating itinerary', {
      destination: input.destination,
      days: input.days,
    });

    const itinerary = this.itineraryService.build(input.destination, input.days);

    if (!itinerary) {
      return {
        found: false,
        message: `Sorry, no itinerary data found for "${input.destination}". Try a recommended destination like Bali, Maldives, or Santorini.`,
        destinationName: input.destination,
        days: input.days,
        dayPlans: [],
        totalEstimatedBudget: 0,
        currency: 'USD',
      };
    }

    return {
      found: true,
      destinationId: itinerary.destinationId,
      destinationName: itinerary.destinationName,
      type: itinerary.type,
      imageUrl: itinerary.imageUrl,
      days: itinerary.days,
      totalEstimatedBudget: itinerary.totalEstimatedBudget,
      currency: itinerary.currency,
      dayPlans: itinerary.dayPlans,
    };
  }

  @Tool({
    name: 'get-itinerary-day',
    description:
      'Get the detailed plan for a single itinerary day by its day id, including places, activities, food suggestions, and estimated budget.',
    inputSchema: getDayInputSchema,
  })
  async getItineraryDay(
    input: z.infer<typeof getDayInputSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Getting itinerary day', { dayId: input.dayId });

    const result = this.itineraryService.getDay(input.dayId);

    if (!result) {
      return {
        found: false,
        message: `No day found for id "${input.dayId}". Day ids look like "bali-day-3".`,
        dayId: input.dayId,
      };
    }

    const { itinerary, day } = result;
    return {
      found: true,
      dayId: day.dayId,
      day: day.day,
      title: day.title,
      destinationName: itinerary.destinationName,
      imageUrl: day.imageUrl,
      places: day.places,
      activities: day.activities,
      food: day.food,
      estimatedBudget: day.estimatedBudget,
      currency: itinerary.currency,
    };
  }
}
