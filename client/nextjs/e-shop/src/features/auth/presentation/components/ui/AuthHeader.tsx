'use client';

import Link from 'next/link';

/**
 * AuthHeader Component
 * Header for authentication pages
 */
export const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-block">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold">DHS Hub</span>
        </div>
      </Link>
    </div>
  );
};
