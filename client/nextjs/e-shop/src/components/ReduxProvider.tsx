'use client';

import { rehydrateAuth } from '@/features/auth/presentation/stores/slices/authSlice';
import { store } from '@/store';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Rehydrate auth state from localStorage when app starts in browser
        store.dispatch(rehydrateAuth());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}