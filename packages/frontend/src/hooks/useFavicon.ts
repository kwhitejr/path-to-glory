import { useEffect } from 'react';

/**
 * Custom hook to dynamically update the favicon based on user authentication status
 * @param isLoggedIn - Whether the user is currently authenticated
 */
export function useFavicon(isLoggedIn: boolean) {
  useEffect(() => {
    // Find existing favicon link element
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    // If no favicon link exists, create one
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }

    // Update favicon based on login status
    const faviconPath = isLoggedIn
      ? '/tophat_favicon.svg'
      : '/tophat_favicon_logged_out.svg';

    link.href = faviconPath;

    console.log(`[useFavicon] Updated favicon to: ${faviconPath}`);
  }, [isLoggedIn]);
}
