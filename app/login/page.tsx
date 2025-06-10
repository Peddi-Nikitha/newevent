'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      
      router.push('/dashboard');
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 relative hidden md:block">
              <div className="absolute inset-0 bg-accent-dark opacity-20"></div>
              <Image 
                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Event planning" 
                width={800}
                height={1000}
                className="object-cover h-full w-full"
                priority
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-10">
                <h2 className="text-3xl font-bold mb-4 text-center drop-shadow-lg">Welcome Back</h2>
                <p className="text-center text-lg drop-shadow-lg">
                  Log in to continue planning your perfect event
                </p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h1 className="text-3xl font-bold text-heading-primary mb-8">Log In to Your Account</h1>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-text-light mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-text-light mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3"
                    placeholder="••••••••"
                    required
                  />
                  <p className="text-sm text-text-light mt-1">
                    <Link href="/forgot-password" className="text-cta-primary hover:underline">
                      Forgot your password?
                    </Link>
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full bg-cta-primary hover:bg-cta-hover text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>
                </div>
                
                <div className="mt-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-3 text-text-light text-sm">Or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-sm font-medium text-text-dark hover:bg-accent-light transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-text-light">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-cta-primary hover:underline font-medium">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 