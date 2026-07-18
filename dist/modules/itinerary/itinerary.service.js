var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { DestinationsService } from '../planning/destinations.service.js';
const DAY_THEMES = [
    'Arrival & First Impressions',
    'Highlights & Sightseeing',
    'Adventure & Activities',
    'Local Culture & Food',
    'Relaxation & Beach Time',
    'Hidden Gems & Exploration',
    'Nightlife & Entertainment',
    'Farewell & Souvenirs',
];
let ItineraryService = class ItineraryService {
    destinationsService;
    constructor(destinationsService) {
        this.destinationsService = destinationsService;
    }
    rotate(arr, index) {
        if (arr.length === 0)
            return undefined;
        return arr[index % arr.length];
    }
    build(destinationQuery, days) {
        const dest = this.destinationsService.findById(destinationQuery);
        if (!dest)
            return null;
        return this.buildForDestination(dest, days);
    }
    buildForDestination(dest, days) {
        const safeDays = Math.max(1, Math.min(days, 14));
        const dayPlans = [];
        for (let i = 0; i < safeDays; i++) {
            const dayNum = i + 1;
            const theme = i === 0
                ? DAY_THEMES[0]
                : i === safeDays - 1 && safeDays > 1
                    ? 'Farewell & Souvenirs'
                    : this.rotate(DAY_THEMES.slice(1, DAY_THEMES.length - 1), i - 1);
            const places = [
                this.rotate(dest.sampleActivities, i),
                this.rotate(dest.sampleActivities, i + 1),
            ].filter(Boolean);
            const activities = [
                `Morning: ${this.rotate(dest.sampleActivities, i)}`,
                `Afternoon: explore ${dest.name} — ${this.rotate(dest.sampleActivities, i + 2)}`,
                i === 0
                    ? 'Evening: settle in and enjoy a welcome dinner'
                    : `Evening: unwind and sample the local scene`,
            ];
            const food = [
                `Lunch: ${this.rotate(dest.sampleFood, i)}`,
                `Dinner: ${this.rotate(dest.sampleFood, i + 1)}`,
            ];
            dayPlans.push({
                dayId: `${dest.id}-day-${dayNum}`,
                day: dayNum,
                title: `Day ${dayNum}: ${theme}`,
                imageUrl: dest.imageUrl,
                places,
                activities,
                food,
                estimatedBudget: dest.dailyBudget,
            });
        }
        return {
            destinationId: dest.id,
            destinationName: dest.name,
            type: dest.type,
            imageUrl: dest.imageUrl,
            days: safeDays,
            totalEstimatedBudget: dest.dailyBudget * safeDays,
            currency: 'USD',
            dayPlans,
        };
    }
    getDay(dayId) {
        // dayId format: <destinationId>-day-<n>
        const match = dayId.trim().toLowerCase().match(/^(.*)-day-(\d+)$/);
        if (!match)
            return null;
        const destId = match[1];
        const dayNum = parseInt(match[2], 10);
        const dest = this.destinationsService.findById(destId);
        if (!dest)
            return null;
        const itinerary = this.buildForDestination(dest, Math.max(dayNum, dayNum));
        const day = itinerary.dayPlans.find((d) => d.day === dayNum);
        if (!day)
            return null;
        return { itinerary, day };
    }
};
ItineraryService = __decorate([
    Injectable({ deps: [DestinationsService] }),
    __metadata("design:paramtypes", [DestinationsService])
], ItineraryService);
export { ItineraryService };
//# sourceMappingURL=itinerary.service.js.map