import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

// Define the base API settings
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    tagTypes: ['Auth', 'User', 'Client', 'Clients', 'Developer', 'Developers', 'Projects', 'Feedback', 'Client-intake', 'Client-interaction', 'Notification', 'NotificationPreferences', 'SecurityLogs', 'TwoFactor', 'Session', 'Document', 'DocumentDetail', 'Section', 'Point'],
    endpoints: () => ({}),
    /**
     * This setting is crucial for Next.js integration
     * It ensures RTK Query works correctly with SSR and server components
     */
    refetchOnReconnect: true,
});