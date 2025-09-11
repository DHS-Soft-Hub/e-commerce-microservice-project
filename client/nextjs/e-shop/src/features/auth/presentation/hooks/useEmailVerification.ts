'use client';

import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/redux';
import { useCallback, useState } from 'react';
import { AuthServiceFactory } from '../../infrastructure/factories/AuthServiceFactory';
import { EmailVerificationServiceFactory } from '../../infrastructure/factories/VerificationServiceFactory';
import { UserMapper } from '../../infrastructure/mappers/UserMapper';
import { validateEmail } from '../../infrastructure/utils/validation';
import { setAuthenticated, setUser, updateLastActivity } from '../stores/slices/authSlice';

/**
 * Email verification form data interface
 */
interface EmailVerificationFormData {
  email: string;
  code: string;
}

/**
 * Email verification hook following SOLID principles
 * Uses EmailVerificationService for business logic operations
 * Follows the architectural pattern: Hook -> Service -> Repository
 */
export const useEmailVerification = () => {
  const dispatch = useAppDispatch();
  const emailVerificationService = EmailVerificationServiceFactory.createEmailVerificationService();
  const authService = AuthServiceFactory.createAuthService();

  const [formData, setFormData] = useState<EmailVerificationFormData>({
    email: '',
    code: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<Partial<EmailVerificationFormData>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<EmailVerificationFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.code) {
      newErrors.code = 'Verification code is required';
    } else if (formData.code.length !== 8) {
      newErrors.code = 'Verification code must be 8 digits';
    } else if (!/^\d{8}$/.test(formData.code)) {
      newErrors.code = 'Verification code must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const updateField = useCallback((field: keyof EmailVerificationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const clearForm = useCallback(() => {
    setFormData({
      email: '',
      code: ''
    });
    setErrors({});
  }, []);

  const verifyEmail = useCallback(async (email?: string, code?: string, token?: string) => {
    // Handle token-based verification (from URL)
    if (token) {
      setIsLoading(true);
      try {
        const result = await emailVerificationService.verifyEmail(token);

        if (result.isSuccess) {
          // Get updated user data after verification
          const userResult = await authService.getCurrentUser();
          if (userResult.isSuccess && userResult.value) {
            // Convert domain User to presentation ExtendedUser for Redux state
            const serializableUser = UserMapper.toSerializable(userResult.value);

            dispatch(setUser(serializableUser));
            dispatch(setAuthenticated(true));
            dispatch(updateLastActivity(new Date().toISOString()));
          }

          toast.success('Email verified successfully!');
          return { success: true };
        } else {
          const errorMessage = result.error?.message || 'Email verification failed';
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (error: unknown) {
        const errorMessage = (error as Error)?.message || 'Email verification failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    }

    // Handle manual email:code verification
    const verificationEmail = email || formData.email;
    const verificationCode = code || formData.code;

    setIsLoading(true);

    try {
      // Use EmailVerificationService for business logic
      const emailCodeToken = `${verificationEmail}:${verificationCode}`;
      const result = await emailVerificationService.verifyEmail(emailCodeToken);

      if (result.isSuccess) {
        // Get updated user data after verification
        const userResult = await authService.getCurrentUser();
        if (userResult.isSuccess && userResult.value) {
          // Convert domain User to presentation ExtendedUser for Redux state
          const serializableUser = UserMapper.toSerializable(userResult.value);

          dispatch(setUser(serializableUser));
          dispatch(setAuthenticated(true));
          dispatch(updateLastActivity(new Date().toISOString()));
        }

        toast.success('Email verified successfully!');
        clearForm();

        return { success: true };
      } else {
        const errorMessage = result.error?.message || 'Email verification failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Email verification failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [emailVerificationService, authService, formData, dispatch, clearForm]);

  const resendVerificationCode = useCallback(async (email?: string) => {
    const resendEmail = email || formData.email;

    if (!resendEmail) {
      toast.error('Email is required to resend verification code');
      return { success: false, error: 'Email required' };
    }

    if (!validateEmail(resendEmail)) {
      toast.error('Please enter a valid email address');
      return { success: false, error: 'Invalid email' };
    }

    setIsResending(true);

    try {
      // Use EmailVerificationService for business logic
      const result = await emailVerificationService.resendVerificationCode(resendEmail);

      if (result.isSuccess) {
        toast.success('Verification code sent! Please check your email.');
        return { success: true };
      } else {
        const errorMessage = result.error?.message || 'Failed to send verification code';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Failed to send verification code';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsResending(false);
    }
  }, [emailVerificationService, formData.email]);

  const handleVerification = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return { success: false, error: 'Validation failed' };
    }

    return await verifyEmail();
  }, [validateForm, verifyEmail]);

  const handleResendCode = useCallback(async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required to resend code' }));
      return { success: false, error: 'Email required' };
    }

    return await resendVerificationCode();
  }, [formData.email, resendVerificationCode]);

  return {
    // Form state
    formData,
    errors,
    isLoading,
    isResending,

    // Form actions
    updateField,
    clearForm,
    validateForm,

    // Auth actions
    verifyEmail,
    resendVerificationCode,
    handleVerification,
    handleResendCode
  };
};
