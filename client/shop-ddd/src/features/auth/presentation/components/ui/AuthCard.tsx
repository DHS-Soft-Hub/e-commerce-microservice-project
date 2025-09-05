'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { AuthHeader } from './AuthHeader';
import { AuthFooter } from './AuthFooter';

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * AuthCard Component
 * Provides consistent card layout for authentication forms
 */
export const AuthCard = ({
  children,
  title,
  description,
  showHeader = false,
  showFooter = false,
  className = ''
}: AuthCardProps) => {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {showHeader && <AuthHeader />}
      
      <Card className="p-6">
        {(title || description) && (
          <div className="text-center mb-6">
            {title && (
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
          </div>
        )}
        
        {children}
      </Card>
      
      {showFooter && <AuthFooter />}
    </div>
  );
};
