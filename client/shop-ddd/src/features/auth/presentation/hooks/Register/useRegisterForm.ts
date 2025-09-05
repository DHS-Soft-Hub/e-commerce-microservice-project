'use client';

import { useToast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';
import { useRegister } from './useRegister';

/**
 * Registration form state interface
 */
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

/**
 * Form validation errors interface
 */
interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

/**
 * Password strength analysis interface
 */
interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
}

/**
 * Register form hook result interface
 */
interface UseRegisterFormResult {
  formData: RegisterFormData;
  formErrors: RegisterFormErrors;
  passwordStrength: PasswordStrength;
  isLoading: boolean;
  error: string | null;
  updateField: (field: keyof RegisterFormData, value: string | boolean) => void;
  handleSubmit: () => Promise<void>;
  isFormValid: () => boolean;
}

/**
 * Registration form management hook
 * Provides form state management while using Clean Architecture register service
 */
export const useRegisterForm = (): UseRegisterFormResult => {
  const { register, isLoading } = useRegister();
  const { toast } = useToast();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToNewsletter: false
  });

  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (formErrors[field as keyof RegisterFormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear general error
    if (error) {
      setError(null);
    }
  }, [formErrors, error]);

  const analyzePasswordStrength = useCallback((password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Use at least 8 characters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score++;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z\d]/.test(password)) score++;
    else feedback.push('Add symbols');

    if (password.length >= 12) score++;

    let level: PasswordStrength['level'] = 'weak';
    if (score >= 5) level = 'very-strong';
    else if (score >= 4) level = 'strong';
    else if (score >= 3) level = 'medium';

    return { score, level, feedback };
  }, []);

  const passwordStrength = analyzePasswordStrength(formData.password);

  const validateForm = useCallback((): boolean => {
    const errors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.username && formData.username.trim() && formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms of service';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const isFormValid = useCallback((): boolean => {
    return !!(
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms &&
      Object.keys(formErrors).length === 0
    );
  }, [formData, formErrors]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username?.trim() || undefined,
        agreeToTerms: formData.agreeToTerms
      });

      if (result.isFailure) {
        const errorMessage = result.error instanceof Error ? result.error.message : result.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success('Account created successfully!');
        // The register hook handles navigation
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [formData, register, validateForm]);

  return {
    formData,
    formErrors,
    passwordStrength,
    isLoading,
    error,
    updateField,
    handleSubmit,
    isFormValid
  };
};
