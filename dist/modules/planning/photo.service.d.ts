/**
 * PhotoService
 *
 * Fetches high-quality destination photos from Unsplash.
 * - If UNSPLASH_ACCESS_KEY is set, uses the official search API for precise results.
 * - Falls back to the keyless `source.unsplash.com` random-image endpoint.
 *
 * Results are cached for 1 hour per query keyword to respect free-tier limits.
 */
export declare class PhotoService {
    private readonly accessKey;
    /**
     * Returns a photo URL for the given search query.
     * Cached 1 hour per unique query string.
     */
    getPhotoUrl(query: string): Promise<string>;
    /**
     * Fetch via the official Unsplash Search Photos API (requires access key).
     */
    private fetchFromApi;
    private keylessFallback;
}
//# sourceMappingURL=photo.service.d.ts.map