// This file serves as the entry point for all shared store modules
// Export your store slices, selectors, and other store-related items from this file
'use client';

import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from '../features/auth/presentation/stores/middleware/authMiddleware';
import { tokenRefreshMiddleware } from '../features/auth/presentation/stores/middleware/tokenRefreshMiddleware';
import authReducer from '../features/auth/presentation/stores/slices/authSlice';
import { apiSlice } from './api';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(authMiddleware.middleware)
            .concat(tokenRefreshMiddleware.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

