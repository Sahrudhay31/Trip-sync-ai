import { ExecutionContext, z } from '@nitrostack/core';
import { ItineraryService } from './itinerary.service.js';
declare const generateInputSchema: z.ZodObject<{
    destination: z.ZodString;
    days: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    days: number;
    destination: string;
}, {
    days: number;
    destination: string;
}>;
declare const getDayInputSchema: z.ZodObject<{
    dayId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    dayId: string;
}, {
    dayId: string;
}>;
export declare class ItineraryTools {
    private itineraryService;
    constructor(itineraryService: ItineraryService);
    generateItinerary(input: z.infer<typeof generateInputSchema>, ctx: ExecutionContext): Promise<{
        found: boolean;
        message: string;
        destinationName: string;
        days: number;
        dayPlans: never[];
        totalEstimatedBudget: number;
        currency: string;
        destinationId?: undefined;
        type?: undefined;
        imageUrl?: undefined;
    } | {
        found: boolean;
        destinationId: string;
        destinationName: string;
        type: string;
        imageUrl: string;
        days: number;
        totalEstimatedBudget: number;
        currency: string;
        dayPlans: import("./itinerary.service.js").ItineraryDay[];
        message?: undefined;
    }>;
    getItineraryDay(input: z.infer<typeof getDayInputSchema>, ctx: ExecutionContext): Promise<{
        found: boolean;
        message: string;
        dayId: string;
        day?: undefined;
        title?: undefined;
        destinationName?: undefined;
        imageUrl?: undefined;
        places?: undefined;
        activities?: undefined;
        food?: undefined;
        estimatedBudget?: undefined;
        currency?: undefined;
    } | {
        found: boolean;
        dayId: string;
        day: number;
        title: string;
        destinationName: string;
        imageUrl: string;
        places: string[];
        activities: string[];
        food: string[];
        estimatedBudget: number;
        currency: string;
        message?: undefined;
    }>;
}
export {};
//# sourceMappingURL=itinerary.tools.d.ts.map