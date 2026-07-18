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
let ItineraryTools = class ItineraryTools {
    itineraryService;
    constructor(itineraryService) {
        this.itineraryService = itineraryService;
    }
    async generateItinerary(input, ctx) {
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
    async getItineraryDay(input, ctx) {
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
};
__decorate([
    Tool({
        name: 'generate-itinerary',
        description: 'Generate a day-wise travel itinerary for a destination. Each day includes places to visit, activities, food suggestions, and an estimated budget. Renders an itinerary day card grid.',
        inputSchema: generateInputSchema,
    }),
    Widget('itinerary-days'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0, Object]),
    __metadata("design:returntype", Promise)
], ItineraryTools.prototype, "generateItinerary", null);
__decorate([
    Tool({
        name: 'get-itinerary-day',
        description: 'Get the detailed plan for a single itinerary day by its day id, including places, activities, food suggestions, and estimated budget.',
        inputSchema: getDayInputSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0, Object]),
    __metadata("design:returntype", Promise)
], ItineraryTools.prototype, "getItineraryDay", null);
ItineraryTools = __decorate([
    Injectable({ deps: [ItineraryService] }),
    __metadata("design:paramtypes", [ItineraryService])
], ItineraryTools);
export { ItineraryTools };
//# sourceMappingURL=itinerary.tools.js.map