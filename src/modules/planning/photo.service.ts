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
@Injectable()
export class PhotoService {
  private readonly accessKey = process.env.UNSPLASH_ACCESS_KEY ?? '';

  /**
   * Returns a photo URL for the given search query.
   * Cached 1 hour per unique query string.
   */
  @Cache({
    ttl: 3600,
    key: (query: any) => `photo:${String(query).toLowerCase().replace(/\s+/g, '-')}`,
  })
  async getPhotoUrl(query: string): Promise<string> {
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
  private async fetchFromApi(query: string): Promise<string> {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${this.accessKey}` },
      });

      if (!res.ok) {
        throw new Error(`Unsplash API error: ${res.status}`);
      }

      const json = (await res.json()) as {
        results: { urls: { regular: string } }[];
      };

      if (json.results && json.results.length > 0) {
        return json.results[0].urls.regular;
      }

      // Fallback if no results
      return this.keylessFallback(query);
    } catch {
      return this.keylessFallback(query);
    }
  }

  private keylessFallback(query: string): string {
    const encoded = encodeURIComponent(query);
    return `https://source.unsplash.com/1600x900/?${encoded},travel`;
  }
}
