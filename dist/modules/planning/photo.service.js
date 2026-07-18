var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Cache } from '@nitrostack/core';
/**
 * PhotoService
 *
 * Fetches high-quality destination photos from Unsplash.
 * - If UNSPLASH_ACCESS_KEY is set, uses the official search API for precise results.
 * - Falls back to the keyless `source.unsplash.com` random-image endpoint.
 *
 * Results are cached for 1 hour per query keyword to respect free-tier limits.
 */
let PhotoService = class PhotoService {
    accessKey = process.env.UNSPLASH_ACCESS_KEY ?? '';
    /**
     * Returns a photo URL for the given search query.
     * Cached 1 hour per unique query string.
     */
    async getPhotoUrl(query) {
        if (this.accessKey) {
            return this.fetchFromApi(query);
        }
        // Keyless fallback: source.unsplash.com serves a random photo matching the query
        const encoded = encodeURIComponent(query);
        return `https://source.unsplash.com/1600x900/?${encoded},travel`;
    }
    /**
     * Fetch via the official Unsplash Search Photos API (requires access key).
     */
    async fetchFromApi(query) {
        try {
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
            const res = await fetch(url, {
                headers: { Authorization: `Client-ID ${this.accessKey}` },
            });
            if (!res.ok) {
                throw new Error(`Unsplash API error: ${res.status}`);
            }
            const json = (await res.json());
            if (json.results && json.results.length > 0) {
                return json.results[0].urls.regular;
            }
            // Fallback if no results
            return this.keylessFallback(query);
        }
        catch {
            return this.keylessFallback(query);
        }
    }
    keylessFallback(query) {
        const encoded = encodeURIComponent(query);
        return `https://source.unsplash.com/1600x900/?${encoded},travel`;
    }
};
__decorate([
    Cache({
        ttl: 3600,
        key: (query) => `photo:${String(query).toLowerCase().replace(/\s+/g, '-')}`,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PhotoService.prototype, "getPhotoUrl", null);
PhotoService = __decorate([
    Injectable()
], PhotoService);
export { PhotoService };
//# sourceMappingURL=photo.service.js.map