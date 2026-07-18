import { Injectable } from '@nitrostack/core';
import { DestinationsService, Destination } from '../planning/destinations.service.js';

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

@Injectable({ deps: [DestinationsService] })
export class ItineraryService {
  constructor(private destinationsService: DestinationsService) {}

  private rotate<T>(arr: T[], index: number): T {
    if (arr.length === 0) return undefined as unknown as T;
    return arr[index % arr.length];
  }

  build(destinationQuery: string, days: number): Itinerary | null {
    const dest = this.destinationsService.findById(destinationQuery);
    if (!dest) return null;
    return this.buildForDestination(dest, days);
  }

  private buildForDestination(dest: Destination, days: number): Itinerary {
    const safeDays = Math.max(1, Math.min(days, 14));
    const dayPlans: ItineraryDay[] = [];

    for (let i = 0; i < safeDays; i++) {
      const dayNum = i + 1;
      const theme =
        i === 0
          ? DAY_THEMES[0]
          : i === safeDays - 1 && safeDays > 1
            ? 'Farewell & Souvenirs'
            : this.rotate(DAY_THEMES.slice(1, DAY_THEMES.length - 1), i - 1);

      const places = [
        this.rotate(dest.sampleActivities, i),
        this.rotate(dest.sampleActivities, i + 1),
      ].filter(Boolean) as string[];

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

  getDay(dayId: string): { itinerary: Itinerary; day: ItineraryDay } | null {
    // dayId format: <destinationId>-day-<n>
    const match = dayId.trim().toLowerCase().match(/^(.*)-day-(\d+)$/);
    if (!match) return null;
    const destId = match[1];
    const dayNum = parseInt(match[2], 10);
    const dest = this.destinationsService.findById(destId);
    if (!dest) return null;
    const itinerary = this.buildForDestination(dest, Math.max(dayNum, dayNum));
    const day = itinerary.dayPlans.find((d) => d.day === dayNum);
    if (!day) return null;
    return { itinerary, day };
  }
}
