import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ptg.kwhitejr.com';

// Cache presigned URLs in memory to avoid redundant requests
// Key: imageKey, Value: { url: string, expiresAt: number }
const urlCache = new Map<string, { url: string; expiresAt: number }>();

/**
 * Hook to fetch and cache presigned URLs for viewing S3 images
 *
 * @param imageKey - The S3 object key (e.g., "army/123/uuid.jpg")
 * @returns The presigned URL (or null if not yet loaded)
 */
export function usePresignedImageUrl(imageKey: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // No image key provided
    if (!imageKey) {
      setUrl(null);
      return;
    }

    // Check cache first
    const cached = urlCache.get(imageKey);
    if (cached && cached.expiresAt > Date.now()) {
      setUrl(cached.url);
      return;
    }

    // Fetch presigned URL from API
    let cancelled = false;
    const keyToFetch = imageKey; // Capture for closure

    async function fetchPresignedUrl() {
      if (!keyToFetch) return; // Type guard

      try {
        const response = await fetch(`${API_BASE_URL}/images/view-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageKey: keyToFetch }),
        });

        if (!response.ok) {
          console.error('Failed to fetch presigned URL:', response.statusText);
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          // Cache the URL (expires 5 minutes before actual expiration to be safe)
          const expiresAt = Date.now() + (data.expiresIn - 300) * 1000;
          urlCache.set(keyToFetch, { url: data.viewUrl, expiresAt });
          setUrl(data.viewUrl);
        }
      } catch (error) {
        console.error('Error fetching presigned URL:', error);
      }
    }

    fetchPresignedUrl();

    return () => {
      cancelled = true;
    };
  }, [imageKey]);

  return url;
}
