import { ExecutionContext, z } from '@nitrostack/core';
import { DestinationsService } from './destinations.service.js';
declare const preferencesInputSchema: z.ZodObject<{
    budget: z.ZodNumber;
    destinationType: z.ZodEnum<["beach", "mountain", "city", "cultural", "adventure"]>;
    days: z.ZodNumber;
    interests: z.ZodArray<z.ZodString, "many">;
    groupSize: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    budget: number;
    destinationType: "beach" | "mountain" | "city" | "cultural" | "adventure";
    days: number;
    interests: string[];
    groupSize?: number | undefined;
}, {
    budget: number;
    destinationType: "beach" | "mountain" | "city" | "cultural" | "adventure";
    days: number;
    interests: string[];
    groupSize?: number | undefined;
}>;
declare const recommendInputSchema: z.ZodObject<{
    budget: z.ZodNumber;
    destinationType: z.ZodEnum<["beach", "mountain", "city", "cultural", "adventure"]>;
    days: z.ZodNumber;
    interests: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    budget: number;
    destinationType: "beach" | "mountain" | "city" | "cultural" | "adventure";
    days: number;
    interests: string[];
}, {
    budget: number;
    destinationType: "beach" | "mountain" | "city" | "cultural" | "adventure";
    days: number;
    interests: string[];
}>;
export declare class PlanningTools {
    private destinationsService;
    constructor(destinationsService: DestinationsService);
    collectPreferences(input: z.infer<typeof preferencesInputSchema>, ctx: ExecutionContext): Promise<{
        summary: string;
        budget: number;
        currency: string;
        destinationType: "beach" | "mountain" | "city" | "cultural" | "adventure";
        days: number;
        groupSize: number | null;
        interests: string[];
        budgetPerDay: number;
        budgetPerPersonPerDay: number | null;
    }>;
    recommendDestination(input: z.infer<typeof recommendInputSchema>, ctx: ExecutionContext): Promise<{
        id: string;
        name: string;
        type: string;
        imageUrl: string;
        tags: string[];
        dailyBudget: number;
        estimatedTripBudget: number;
        whyItFits: string;
        matchScore: number;
        matchedInterests: string[];
        sampleActivities: string[];
        sampleFood: string[];
        days: number;
        alternatives: {
            id: string;
            name: string;
            imageUrl: string;
            type: string;
        }[];
    }>;
}
export {};
//# sourceMappingURL=planning.tools.d.ts.map