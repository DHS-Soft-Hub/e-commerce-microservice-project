'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook that detects if a media query matches
 * @param query The media query to match, e.g. '(max-width: 768px)'
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        // Create a media query list
        const media = window.matchMedia(query);

        // Set the initial state
        setMatches(media.matches);

        // Define a callback function to handle changes
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Start listening for changes
        media.addEventListener('change', listener);

        // Clean up when component unmounts
        return () => {
            media.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
}