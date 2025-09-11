import type { AppDispatch } from '@/store';
import { store } from '@/store';
import { setOAuthRepositoryDispatch } from '../../infrastructure/repositories/OAuthRepository';

/**
 * Initialize OAuth repository with store dispatch
 * This should be called during app initialization
 */
export const initializeOAuthRepository = (): void => {
  setOAuthRepositoryDispatch(store.dispatch as AppDispatch);
};

/**
 * OAuth repository initialization hook for React components
 */
export const useOAuthRepositoryInit = (): void => {
  // This ensures the repository has access to store dispatch
  if (typeof window !== 'undefined') {
    initializeOAuthRepository();
  }
};
