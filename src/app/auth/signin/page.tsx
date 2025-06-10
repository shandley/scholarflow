'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/profile/create');
      }
    });
  }, [router]);

  const handleOrcidSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('orcid', { callbackUrl: '/profile/create' });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-warm-beige min-h-screen">
      <div className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-charcoal mb-4 text-3xl font-bold">
              Sign In to ScholarFlow
            </h1>
            <p className="text-gray-600">
              Connect your ORCID account to get started with your academic
              profile
            </p>
          </div>

          <div className="card">
            <div className="mb-6 text-center">
              <div className="bg-sage-green mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1.4 5.8c.4-.4 1-.4 1.4 0s.4 1 0 1.4L9.4 9.8c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l2.6-2.6zm0 8.4c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l2.6-2.6c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-2.6 2.6z" />
                </svg>
              </div>
              <h2 className="text-charcoal mb-2 text-xl font-semibold">
                ORCID Authentication
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Your publications and academic information will be automatically
                imported from your ORCID profile
              </p>
            </div>

            <button
              onClick={handleOrcidSignIn}
              disabled={isLoading}
              className="bg-sage-green w-full rounded-lg px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Connecting...
                </div>
              ) : (
                'Continue with ORCID'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-sage-green hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-sage-green hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an ORCID account?{' '}
              <a
                href="https://orcid.org/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-green font-medium hover:underline"
              >
                Create one free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
