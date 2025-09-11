'use client';

import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  showRequirements?: boolean;
  minLength?: number;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  weight: number;
}

/**
 * Password Strength Indicator Component
 * Displays password strength and requirements
 */
export const PasswordStrengthIndicator = ({
  password,
  className = '',
  showRequirements = true,
  minLength = 8
}: PasswordStrengthIndicatorProps) => {
  const requirements: PasswordRequirement[] = useMemo(() => [
    {
      label: `At least ${minLength} characters`,
      test: (pwd) => pwd.length >= minLength,
      weight: 25
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      weight: 20
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      weight: 20
    },
    {
      label: 'Contains number',
      test: (pwd) => /\d/.test(pwd),
      weight: 15
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      weight: 20
    }
  ], [minLength]);

  const strength = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: 'Very Weak',
        color: 'red',
        passedRequirements: []
      };
    }

    const passedRequirements = requirements.filter(req => req.test(password));
    const score = passedRequirements.reduce((sum, req) => sum + req.weight, 0);

    let label = 'Very Weak';
    let color = 'red';

    if (score >= 80) {
      label = 'Strong';
      color = 'green';
    } else if (score >= 60) {
      label = 'Good';
      color = 'blue';
    } else if (score >= 40) {
      label = 'Fair';
      color = 'yellow';
    } else if (score >= 20) {
      label = 'Weak';
      color = 'orange';
    }

    return {
      score,
      label,
      color,
      passedRequirements
    };
  }, [password, requirements]);

  const getProgressColor = () => {
    switch (strength.color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const getTextColor = () => {
    switch (strength.color) {
      case 'green':
        return 'text-green-600';
      case 'blue':
        return 'text-blue-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'orange':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Password strength</span>
          <span className={`font-medium ${getTextColor()}`}>
            {strength.label}
          </span>
        </div>
        
        <div className="relative">
          <Progress value={strength.score} className="h-2" />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Password must contain:</p>
          <ul className="space-y-1">
            {requirements.map((requirement, index) => {
              const isPassed = requirement.test(password);
              return (
                <li key={index} className="flex items-center text-sm">
                  {isPassed ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <span className={isPassed ? 'text-green-600' : 'text-muted-foreground'}>
                    {requirement.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Additional Security Tips */}
      {strength.score < 60 && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Tips for a stronger password:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {!requirements[0].test(password) && (
              <li>Use at least {minLength} characters</li>
            )}
            {!requirements[1].test(password) && (
              <li>Add uppercase letters (A-Z)</li>
            )}
            {!requirements[2].test(password) && (
              <li>Add lowercase letters (a-z)</li>
            )}
            {!requirements[3].test(password) && (
              <li>Include numbers (0-9)</li>
            )}
            {!requirements[4].test(password) && (
              <li>Use special characters (!@#$%^&*)</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
