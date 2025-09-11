import { TokenStorageUtils } from '@/utils/tokenStorage';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

/**
 * Check if code is running in browser
 * Used to prevent storage access on server
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Base query configuration for API requests
 * Handles access token injection for authenticated requests
 * Token refresh is handled by middleware layer
 */
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    credentials: 'include', // Include cookies for refresh token
    prepareHeaders: (headers, { getState }) => {
        // Add access token to requests (only in browser)
        if (isBrowser) {
            try {
                const accessToken = TokenStorageUtils.getAccessToken();
                if (accessToken) {
                    headers.set('authorization', `Bearer ${accessToken}`);
                }
            } catch (error) {
                console.error('Error setting auth header:', error);
            }
        }

        return headers;
    },
});