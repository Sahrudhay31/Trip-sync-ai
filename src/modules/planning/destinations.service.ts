import { Injectable } from '@nitrostack/core';
import { PhotoService } from './photo.service.js';
import * as fs from 'fs';
import * as path from 'path';

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

@Injectable({ deps: [PhotoService] })
export class DestinationsService {
  constructor(private photoService: PhotoService) {}

  private destinations: Destination[] | null = null;

  private load(): Destination[] {
    if (this.destinations) return this.destinations;
    const filePath = path.join(process.cwd(), 'fixtures', 'destinations.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    this.destinations = JSON.parse(raw) as Destination[];
    return this.destinations;
  }

  getAll(): Destination[] {
    return this.load();
  }

  findById(id: string): Destination | undefined {
    const norm = id.trim().toLowerCase();
    return this.load().find(
      (d) => d.id === norm || d.name.toLowerCase().includes(norm)
    );
  }

  /**
   * Score destinations against user preferences and return them ranked best-first.
   * Fetches a live Unsplash photo for the top result.
   */
  async recommend(prefs: {
    budget?: number;
    days?: number;
    type?: string;
    interests?: string[];
  }): Promise<ScoredDestination[]> {
    const days = prefs.days && prefs.days > 0 ? prefs.days : 1;
    const perDayBudget = prefs.budget ? prefs.budget / days : undefined;
    const interests = (prefs.interests ?? []).map((i) => i.toLowerCase());
    const type = prefs.type?.toLowerCase();

    const ranked = this.load()
      .map((destination) => {
        let score = 0;
        const matchedInterests: string[] = [];

        // Type match
        if (type && destination.type.toLowerCase() === type) {
          score += 40;
        }

        // Interest match against tags
        for (const interest of interests) {
          const hit = destination.tags.some(
            (t) => t.toLowerCase().includes(interest) || interest.includes(t.toLowerCase())
          );
          if (hit) {
            score += 20;
            matchedInterests.push(interest);
          }
        }

        // Budget fit (per-day budget must comfortably cover destination daily budget)
        if (perDayBudget !== undefined) {
          if (perDayBudget >= destination.dailyBudget) {
            score += 25;
          } else if (perDayBudget >= destination.dailyBudget * 0.75) {
            score += 10;
          } else {
            score -= 10;
          }
        }

        return { destination, score, matchedInterests };
      })
      .sort((a, b) => b.score - a.score);

    // Enrich top 4 results with live photos (in parallel)
    const topFour = ranked.slice(0, 4);
    const photos = await Promise.all(
      topFour.map((r) =>
        this.photoService
          .getPhotoUrl(`${r.destination.name} ${r.destination.type} travel`)
          .catch(() => r.destination.imageUrl)
      )
    );

    return ranked.map((r, i) => ({
      ...r,
      livePhotoUrl: i < 4 ? photos[i] : r.destination.imageUrl,
    }));
  }
}
