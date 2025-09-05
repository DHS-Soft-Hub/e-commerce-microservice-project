'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { usePasswordReset } from '../../hooks/usePasswordReset';

/**
 * Change Password Form Component  
 * Multi-step password reset process
 * Step 2: Reset password with token from email
 */
export const ChangePasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    formData,
    formErrors,
    isLoading,
    error,
    isResetComplete,
    passwordStrength,
    updateField,
    handleSubmitPasswordReset,
    isFormValid
  } = usePasswordReset();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitPasswordReset();
  };

  // Success state after password is reset
  if (isResetComplete) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Password reset successfully</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </div>

          <Button 
            className="w-full"
            onClick={() => window.location.href = '/auth/login'}
          >
            Continue to login
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Create new password</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your new password must be different from your previous password
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="pl-10 pr-10"
                value={formData.newPassword}
                onChange={(e) => updateField('newPassword', e.target.value)}
                required
                autoFocus
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Password strength</span>
                  <span className={`font-medium ${
                    passwordStrength.score >= 80 ? 'text-green-600' :
                    passwordStrength.score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength.score} 
                  className="h-2"
                />
                {passwordStrength.suggestions.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {passwordStrength.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {formErrors.newPassword && (
              <p className="text-sm text-red-600">{formErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="pl-10 pr-10"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Updating password...' : 'Update password'}
          </Button>
        </form>
      </div>
    </Card>
  );
};
