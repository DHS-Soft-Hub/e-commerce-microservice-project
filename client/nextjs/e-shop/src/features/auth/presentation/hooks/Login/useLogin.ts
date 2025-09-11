'use client';

import { useToast } from '@/hooks/use-toast';
import { TokenStorageUtils } from '@/utils';
import { IResult } from '@dhs-hub/core';
import { useAppDispatch } from '@/hooks/redux';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { AuthResult, LoginCredentials } from '../../../domain/types/auth.domain.types';
import { AuthServiceFactory } from '../../../infrastructure/factories/AuthServiceFactory';
import { UserMapper } from '../../../infrastructure/mappers/UserMapper';
import { setAuthenticated, setUser, updateLastActivity } from '../../stores/slices/authSlice';

/**
 * Login form data interface
 */
interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface UseLoginResult {
  login: (credentials: LoginFormData) => Promise<IResult<AuthResult>>;
  isLoading: boolean;
}

/**
 * Login hook following Clean Architecture principles
 * Uses concrete application service for business logic
 */
export const useLogin = (): UseLoginResult => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authService = AuthServiceFactory.createAuthService();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: LoginFormData): Promise<IResult<AuthResult>> => {
    setIsLoading(true);

    try {
      const loginCredentials: LoginCredentials = {
        email: credentials.email,
        password: credentials.password
      };

      // Use AuthService login method
      const result = await authService.login(loginCredentials);

      if (!result.isSuccess || !result.value) {
        const errorMessage = result.error?.message || 'Login failed';
        toast.error(errorMessage);
        return {
          isSuccess: false,
          isFailure: true,
          error: result.error || new Error('Login failed')
        };
      }

      const authResult = result.value as AuthResult;

      // Convert domain User to presentation ExtendedUser for Redux state using authSlice utility
      const serializableUser = UserMapper.toSerializable(authResult.user);

      // Update Redux state
      dispatch(setUser(serializableUser));
      dispatch(setAuthenticated(true));
      dispatch(updateLastActivity(new Date().toISOString()));

      // Store tokens using TokenStorageUtils
      TokenStorageUtils.setAccessToken(authResult.accessToken);
      toast.success('Login successful!');

      // Redirect to dashboard or intended page
      router.push('/dashboard');

      return {
        isSuccess: true,
        isFailure: false,
        value: authResult
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router, authService, toast]);

  return {
    login,
    isLoading
  };
};
