'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, User as UserIcon } from 'lucide-react';

interface NavigationProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  variant?: 'public' | 'authenticated';
}

export default function Navigation({ user, variant = 'public' }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(path);
  };

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
  ];

  const authenticatedLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/skills', label: 'Skills' },
    { href: '/dashboard/career-planner', label: 'Career Planner' },
    { href: '/dashboard/credibility', label: 'Credibility' },
    { href: '/profile', label: 'Profile' },
  ];

  const links = variant === 'public' ? publicLinks : authenticatedLinks;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={variant === 'public' ? '/' : '/dashboard'}>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent cursor-pointer">
                Credably
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Section */}
            {variant === 'authenticated' && user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {user.name || user.email}
                </Link>
                {user.image ? (
                  <Link href="/profile">
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
                    />
                  </Link>
                ) : (
                  <Link href="/profile">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {variant === 'authenticated' && user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors pt-4 border-t border-gray-800"
                >
                  {user.name || user.email}
                </Link>
              ) : (
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-800">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md text-white font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

