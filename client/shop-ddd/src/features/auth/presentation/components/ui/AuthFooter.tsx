'use client';

import Link from 'next/link';

/**
 * AuthFooter Component
 * Footer for authentication pages
 */
export const AuthFooter = () => {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground">
      <div className="space-x-4">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/help" className="hover:underline">
          Help
        </Link>
      </div>
      
      <div className="mt-4">
        <p>&copy; 2024 DHS Hub. All rights reserved.</p>
      </div>
    </div>
  );
};
