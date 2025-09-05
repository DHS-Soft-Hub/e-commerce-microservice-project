'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useRegisterForm } from '../../hooks/Register/useRegisterForm';
import { Eye, EyeOff, Mail, Lock, User, X } from 'lucide-react';
import Link from 'next/link';

/**
 * Registration Form Component
 * Handles new user registration with validation
 */
export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    formData,
    formErrors,
    passwordStrength,
    isLoading,
    error,
    updateField,
    handleSubmit,
    isFormValid
  } = useRegisterForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const getPasswordStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-blue-500';
      case 'very-strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPasswordStrengthWidth = (score: number) => {
    return `${(score / 6) * 100}%`;
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Join us today and start your journey
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={`pl-10 ${formErrors.firstName ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="given-name"
              />
            </div>
            {formErrors.firstName && (
              <p className="text-sm text-red-500">{formErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={`pl-10 ${formErrors.lastName ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>
            {formErrors.lastName && (
              <p className="text-sm text-red-500">{formErrors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Username (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="username">Username (Optional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username || ''}
                onChange={(e) => updateField('username', e.target.value)}
                className={`pl-10 ${formErrors.username ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            {formErrors.username && (
              <p className="text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.level === 'weak' ? 'bg-red-500' :
                        passwordStrength.level === 'medium' ? 'bg-yellow-500' :
                        passwordStrength.level === 'strong' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: getPasswordStrengthWidth(passwordStrength.score) }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength.level)}`}>
                    {passwordStrength.level.replace('-', ' ')}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {passwordStrength.feedback.map((feedback: string, index: number) => (
                      <li key={index} className="flex items-center space-x-1">
                        <X className="h-3 w-3 text-red-500" />
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className={`pl-10 pr-10 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Switch
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateField('agreeToTerms', checked)}
                disabled={isLoading}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
                {formErrors.agreeToTerms && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.agreeToTerms}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="subscribeToNewsletter"
                checked={formData.subscribeToNewsletter}
                onCheckedChange={(checked) => updateField('subscribeToNewsletter', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="subscribeToNewsletter" className="text-sm">
                Subscribe to our newsletter for updates and tips
              </Label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
};
