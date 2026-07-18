import { DestinationsService } from '../planning/destinations.service.js';
export interface ItineraryDay {
    dayId: string;
    day: number;
    title: string;
    imageUrl: string;
    places: string[];
    activities: string[];
    food: string[];
    estimatedBudget: number;
}
export interface Itinerary {
    destinationId: string;
    destinationName: string;
    type: string;
    imageUrl: string;
    days: number;
    totalEstimatedBudget: number;
    currency: string;
    dayPlans: ItineraryDay[];
}
export declare class ItineraryService {
    private destinationsService;
    constructor(destinationsService: DestinationsService);
    private rotate;
    build(destinationQuery: string, days: number): Itinerary | null;
    private buildForDestination;
    getDay(dayId: string): {
        itinerary: Itinerary;
        day: ItineraryDay;
    } | null;
}
//# sourceMappingURL=itinerary.service.d.ts.map