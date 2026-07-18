import { PhotoService } from './photo.service.js';
export interface Destination {
    id: string;
    name: string;
    type: string;
    tags: string[];
    imageUrl: string;
    dailyBudget: number;
    bestFor: string;
    sampleActivities: string[];
    sampleFood: string[];
}
export interface ScoredDestination {
    destination: Destination;
    score: number;
    matchedInterests: string[];
    livePhotoUrl: string;
}
export declare class DestinationsService {
    private photoService;
    constructor(photoService: PhotoService);
    private destinations;
    private load;
    getAll(): Destination[];
    findById(id: string): Destination | undefined;
    /**
     * Score destinations against user preferences and return them ranked best-first.
     * Fetches a live Unsplash photo for the top result.
     */
    recommend(prefs: {
        budget?: number;
        days?: number;
        type?: string;
        interests?: string[];
    }): Promise<ScoredDestination[]>;
}
//# sourceMappingURL=destinations.service.d.ts.map