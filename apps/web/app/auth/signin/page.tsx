'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@smatrx/ui';
import { Card } from '@smatrx/ui';
import { Github, Linkedin, Mail, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const LAST_PROVIDER_KEY = 'credably_last_auth_provider';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  const provider = searchParams.get('provider');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [lastUsedProvider, setLastUsedProvider] = useState<string | null>(null);

  // Load last used provider from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LAST_PROVIDER_KEY);
    if (stored) {
      setLastUsedProvider(stored);
    }
  }, []);

  const handleSignIn = (provider: string) => {
    setIsLoading(provider);
    // Save the provider to localStorage
    localStorage.setItem(LAST_PROVIDER_KEY, provider);
    signIn(provider, {
      callbackUrl,
    });
  };

  // Auto-sign in with provider if specified
  React.useEffect(() => {
    if (provider && !isLoading && !error) {
      handleSignIn(provider);
    }
  }, [provider]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Card className="p-8 bg-gray-900/50 backdrop-blur-lg border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome to Credably
            </h1>
            <p className="text-gray-400">
              {provider && isLoading ? 
                `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...` : 
                'Sign in to start your career transformation journey'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              {error === 'OAuthSignin' && 'Error connecting to provider. Please try again.'}
              {error === 'OAuthCallback' && 'Error during authentication. Please try again.'}
              {error === 'OAuthCreateAccount' && 'Could not create account. Please try a different method.'}
              {error === 'EmailCreateAccount' && 'Could not create account. Please try a different method.'}
              {error === 'Callback' && 'Error during authentication callback.'}
              {error === 'OAuthAccountNotLinked' && 'This email is already associated with another account. Please sign in with the original method you used.'}
              {error === 'Default' && 'An error occurred. Please try again.'}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Button
                onClick={() => handleSignIn('github')}
                disabled={isLoading !== null}
                className={`w-full justify-center gap-3 ${lastUsedProvider === 'github' ? 'ring-2 ring-purple-500' : ''}`}
                variant="outline"
              >
                <Github className="w-5 h-5" />
                {isLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
              </Button>
              {lastUsedProvider === 'github' && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  Last Used
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                onClick={() => handleSignIn('linkedin')}
                disabled={isLoading !== null}
                className={`w-full justify-center gap-3 ${lastUsedProvider === 'linkedin' ? 'ring-2 ring-purple-500' : ''}`}
                variant="outline"
              >
                <Linkedin className="w-5 h-5" />
                {isLoading === 'linkedin' ? 'Connecting...' : 'Continue with LinkedIn'}
              </Button>
              {lastUsedProvider === 'linkedin' && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  Last Used
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                onClick={() => handleSignIn('google')}
                disabled={isLoading !== null}
                className={`w-full justify-center gap-3 ${lastUsedProvider === 'google' ? 'ring-2 ring-purple-500' : ''}`}
                variant="outline"
              >
                <Mail className="w-5 h-5" />
                {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </Button>
              {lastUsedProvider === 'google' && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  Last Used
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              We'll automatically import your skills from your connected accounts
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
