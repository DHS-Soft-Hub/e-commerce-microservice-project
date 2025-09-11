'use client';

import { useToast } from '@/hooks/use-toast';
import { useCallback, useMemo, useState } from 'react';

/**
 * Password Reset Request Interface
 */
interface IPasswordResetRequest {
  email: string;
  redirectUrl?: string;
}

/**
 * Password Reset Confirmation Interface
 */
interface IPasswordResetConfirmation {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password strength calculation
 */
interface PasswordStrength {
  score: number;
  label: string;
  suggestions: string[];
}

/**
 * Password Reset Form State
 */
interface PasswordResetFormData {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Form Errors
 */
interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * Hook for password reset functionality
 * Handles both email request and password reset steps
 */
export const usePasswordReset = () => {
  const { toast } = useToast();

  // Email request state
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Password reset state
  const [formData, setFormData] = useState<PasswordResetFormData>({
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetComplete, setIsResetComplete] = useState(false);

  /**
   * Email validation
   */
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  /**
   * Password strength calculation
   */
  const passwordStrength = useMemo((): PasswordStrength => {
    const password = formData.newPassword;
    if (!password) {
      return { score: 0, label: 'Very Weak', suggestions: [] };
    }

    let score = 0;
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      suggestions.push('Use at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      suggestions.push('Include uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      suggestions.push('Include lowercase letters');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 12.5;
    } else {
      suggestions.push('Include numbers');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 12.5;
    } else {
      suggestions.push('Include special characters');
    }

    let label = 'Very Weak';
    if (score >= 80) label = 'Strong';
    else if (score >= 60) label = 'Good';
    else if (score >= 40) label = 'Fair';
    else if (score >= 20) label = 'Weak';

    return { score, label, suggestions };
  }, [formData.newPassword]);

  /**
   * Form validation
   */
  const validateForm = useCallback(() => {
    const errors: FormErrors = {};

    if (!formData.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 40) {
      errors.newPassword = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, passwordStrength.score]);

  /**
   * Form validity check
   */
  const isFormValid = useMemo(() => {
    return formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword === formData.confirmPassword &&
      passwordStrength.score >= 40;
  }, [formData, passwordStrength.score]);

  /**
   * Update email
   */
  const updateEmail = useCallback((value: string) => {
    setEmail(value);
    setError(null);
  }, []);

  /**
   * Update form field
   */
  const updateField = useCallback((field: keyof PasswordResetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);

    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  /**
   * Handle email request submission
   */
  const handleSubmitEmailRequest = useCallback(async () => {
    if (!isEmailValid) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const _requestData: IPasswordResetRequest = {
        email,
        redirectUrl: `${window.location.origin}/auth/reset-password`
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsEmailSent(true);
      toast({
        title: 'Reset link sent',
        description: `We've sent a password reset link to ${email}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, isEmailValid, toast]);

  /**
   * Handle password reset submission
   */
  const handleSubmitPasswordReset = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get token from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        throw new Error('Reset token not found');
      }

      // TODO: Replace with actual API call
      const _resetData: IPasswordResetConfirmation = {
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsResetComplete(true);
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, toast]);

  return {
    // Email request state
    email,
    isEmailSent,
    isEmailValid,
    updateEmail,
    handleSubmitEmailRequest,

    // Password reset state
    formData,
    formErrors,
    isLoading,
    error,
    isResetComplete,
    passwordStrength,
    isFormValid,
    updateField,
    handleSubmitPasswordReset,
  };
};
