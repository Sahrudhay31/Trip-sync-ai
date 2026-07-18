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
import { PhotoService } from './photo.service.js';
import * as fs from 'fs';
import * as path from 'path';
let DestinationsService = class DestinationsService {
    photoService;
    constructor(photoService) {
        this.photoService = photoService;
    }
    destinations = null;
    load() {
        if (this.destinations)
            return this.destinations;
        const filePath = path.join(process.cwd(), 'fixtures', 'destinations.json');
        const raw = fs.readFileSync(filePath, 'utf-8');
        this.destinations = JSON.parse(raw);
        return this.destinations;
    }
    getAll() {
        return this.load();
    }
    findById(id) {
        const norm = id.trim().toLowerCase();
        return this.load().find((d) => d.id === norm || d.name.toLowerCase().includes(norm));
    }
    /**
     * Score destinations against user preferences and return them ranked best-first.
     * Fetches a live Unsplash photo for the top result.
     */
    async recommend(prefs) {
        const days = prefs.days && prefs.days > 0 ? prefs.days : 1;
        const perDayBudget = prefs.budget ? prefs.budget / days : undefined;
        const interests = (prefs.interests ?? []).map((i) => i.toLowerCase());
        const type = prefs.type?.toLowerCase();
        const ranked = this.load()
            .map((destination) => {
            let score = 0;
            const matchedInterests = [];
            // Type match
            if (type && destination.type.toLowerCase() === type) {
                score += 40;
            }
            // Interest match against tags
            for (const interest of interests) {
                const hit = destination.tags.some((t) => t.toLowerCase().includes(interest) || interest.includes(t.toLowerCase()));
                if (hit) {
                    score += 20;
                    matchedInterests.push(interest);
                }
            }
            // Budget fit (per-day budget must comfortably cover destination daily budget)
            if (perDayBudget !== undefined) {
                if (perDayBudget >= destination.dailyBudget) {
                    score += 25;
                }
                else if (perDayBudget >= destination.dailyBudget * 0.75) {
                    score += 10;
                }
                else {
                    score -= 10;
                }
            }
            return { destination, score, matchedInterests };
        })
            .sort((a, b) => b.score - a.score);
        // Enrich top 4 results with live photos (in parallel)
        const topFour = ranked.slice(0, 4);
        const photos = await Promise.all(topFour.map((r) => this.photoService
            .getPhotoUrl(`${r.destination.name} ${r.destination.type} travel`)
            .catch(() => r.destination.imageUrl)));
        return ranked.map((r, i) => ({
            ...r,
            livePhotoUrl: i < 4 ? photos[i] : r.destination.imageUrl,
        }));
    }
};
DestinationsService = __decorate([
    Injectable({ deps: [PhotoService] }),
    __metadata("design:paramtypes", [PhotoService])
], DestinationsService);
export { DestinationsService };
//# sourceMappingURL=destinations.service.js.map