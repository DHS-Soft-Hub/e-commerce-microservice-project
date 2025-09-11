'use client';

import { useToast } from '@/hooks/use-toast';
import { IResult } from '@dhs-hub/core';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { UserEntity } from '../../../domain/entities/User';
import { RegistrationData } from '../../../domain/types/auth.domain.types';
import { AuthServiceFactory } from '../../../infrastructure/factories/AuthServiceFactory';

/**
 * Registration form data interface
 */
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  agreeToTerms: boolean;
}

interface UseRegisterResult {
  register: (data: RegisterFormData) => Promise<IResult<UserEntity>>;
  isLoading: boolean;
}

/**
 * Register hook following Clean Architecture principles
 * Uses concrete application service for business logic
 */
export const useRegister = (): UseRegisterResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize concrete auth service
  const authService = AuthServiceFactory.createAuthService();

  const register = useCallback(async (data: RegisterFormData): Promise<IResult<UserEntity>> => {
    setIsLoading(true);

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('Passwords do not match')
        };
      }

      const registrationData: RegistrationData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        agreeToTerms: data.agreeToTerms
      };

      // Use AuthService register method
      const result = await authService.register(registrationData);

      if (!result.isSuccess || !result.value) {
        const errorMessage = result.error?.message || 'Registration failed';
        toast.error(errorMessage);
        return {
          isSuccess: false,
          isFailure: true,
          error: result.error || new Error('Registration failed')
        };
      }

      const userEntity = result.value as UserEntity;

      toast.success('Registration successful! Please check your email to verify your account.');

      // Redirect to login page
      router.push('/auth/login');

      return {
        isSuccess: true,
        isFailure: false,
        value: userEntity
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    } finally {
      setIsLoading(false);
    }
  }, [router, authService]);

  return {
    register,
    isLoading
  };
};
