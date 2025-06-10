'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

// Extend the User type to include role
interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Type guard to check if user has a role
  const hasRole = (user?: CustomUser): user is CustomUser & { role: string } => {
    return !!user && !!user.role;
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-heading-primary">
            Happy Happenings
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/events" className="text-text-light hover:text-heading-primary font-medium transition-colors">
            Explore Events
          </Link>
          <Link href="/vendors" className="text-text-light hover:text-heading-primary font-medium transition-colors">
            Find Vendors
          </Link>
          <Link href="/how-it-works" className="text-text-light hover:text-heading-primary font-medium transition-colors">
            How It Works
          </Link>
          
          {session ? (
            <>
              {hasRole(session.user) && session.user.role === 'VENDOR' && (
                <Link href="/vendor/dashboard" className="text-text-light hover:text-heading-primary font-medium transition-colors">
                  Vendor Dashboard
                </Link>
              )}
              {hasRole(session.user) && session.user.role === 'ADMIN' && (
                <Link href="/admin/dashboard" className="text-text-light hover:text-heading-primary font-medium transition-colors">
                  Admin Dashboard
                </Link>
              )}
              <div className="relative group">
                <button className="flex items-center text-text-light hover:text-heading-primary font-medium transition-colors">
                  {session.user?.name || 'User'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/dashboard" className="block px-4 py-2 text-text-light hover:bg-accent-light hover:text-heading-primary">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-text-light hover:bg-accent-light hover:text-heading-primary">
                    Profile
                  </Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-text-light hover:bg-accent-light hover:text-heading-primary"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 border border-cta-primary text-cta-primary rounded-lg hover:bg-cta-primary hover:text-white font-medium transition-colors">
                Log In
              </Link>
              <Link href="/register" className="px-4 py-2 bg-cta-primary hover:bg-cta-hover text-white rounded-lg font-medium shadow-md transition-all duration-300 hover:shadow-lg">
                Sign Up
              </Link>
            </>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-text-light"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <Link href="/events" className="block py-2 text-text-light hover:text-heading-primary">
              Explore Events
            </Link>
            <Link href="/vendors" className="block py-2 text-text-light hover:text-heading-primary">
              Find Vendors
            </Link>
            <Link href="/how-it-works" className="block py-2 text-text-light hover:text-heading-primary">
              How It Works
            </Link>
            
            {session ? (
              <>
                {hasRole(session.user) && session.user.role === 'VENDOR' && (
                  <Link href="/vendor/dashboard" className="block py-2 text-text-light hover:text-heading-primary">
                    Vendor Dashboard
                  </Link>
                )}
                {hasRole(session.user) && session.user.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" className="block py-2 text-text-light hover:text-heading-primary">
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/dashboard" className="block py-2 text-text-light hover:text-heading-primary">
                  Dashboard
                </Link>
                <Link href="/profile" className="block py-2 text-text-light hover:text-heading-primary">
                  Profile
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left py-2 text-text-light hover:text-heading-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-text-light hover:text-heading-primary">
                  Log In
                </Link>
                <Link href="/register" className="block py-2 text-cta-primary font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 