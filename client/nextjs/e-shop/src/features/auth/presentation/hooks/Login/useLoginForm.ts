'use client';

import { useToast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';
import { useLogin } from './useLogin';

/**
 * Login form state interface
 */
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Form validation errors interface
 */
interface LoginFormErrors {
  email?: string;
  password?: string;
}

/**
 * Login form hook result interface
 */
interface UseLoginFormResult {
  formData: LoginFormData;
  formErrors: LoginFormErrors;
  isLoading: boolean;
  error: string | null;
  updateField: (field: keyof LoginFormData, value: string | boolean) => void;
  handleSubmit: () => Promise<void>;
  isFormValid: () => boolean;
}

/**
 * Login form management hook
 * Provides form state management while using Clean Architecture login service
 */
export const useLoginForm = (): UseLoginFormResult => {
  const { login, isLoading } = useLogin();
  const { toast } = useToast();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (formErrors[field as keyof LoginFormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear general error
    if (error) {
      setError(null);
    }
  }, [formErrors, error]);

  const validateForm = useCallback((): boolean => {
    const errors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const isFormValid = useCallback((): boolean => {
    return !!(formData.email.trim() && formData.password.trim() && Object.keys(formErrors).length === 0);
  }, [formData, formErrors]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (result.isFailure) {
        const errorMessage = result.error instanceof Error ? result.error.message : result.error || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success('Login successful!');
        // The login hook handles navigation and state updates
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [formData, login, validateForm, toast]);

  return {
    formData,
    formErrors,
    isLoading,
    error,
    updateField,
    handleSubmit,
    isFormValid
  };
};
