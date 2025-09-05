'use client';

import { useToast } from '@/hooks/use-toast';
import { TokenStorageUtils } from '@/utils';
import { useAppDispatch } from '@/hooks/redux';
import { useCallback, useMemo } from 'react';
import { AuthServiceFactory } from '../../infrastructure/factories/AuthServiceFactory';
import { clearAuth } from '../stores/slices/authSlice';

/**
 * Logout hook following SOLID principles
 * Uses AuthServiceFactory for proper dependency injection
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const authService = useMemo(() => AuthServiceFactory.createAuthService(), []);
  const { toast } = useToast();

  const signOut = useCallback(async () => {
    try {
      // Call service layer logout
      await authService.logout();

      // Clear all local state and tokens using storage utilities
      TokenStorageUtils.clearTokens();
      dispatch(clearAuth());

      toast.success('Logged out successfully!');
      return { success: true };
    } catch (error: unknown) {
      // Even if logout fails on server, clear local state using storage utilities
      TokenStorageUtils.clearTokens();
      dispatch(clearAuth());

      const errorMessage = (error as Error)?.message || 'Logout failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authService, dispatch]);

  return {
    signOut,
    isLoading: false // Service layer handles loading state
  };
};
