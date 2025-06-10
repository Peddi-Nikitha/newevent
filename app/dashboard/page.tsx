'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 px-4 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-gray-500">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>
              
              <nav className="dashboard-nav">
                <ul>
                  <li className="mb-1">
                    <Link href="/dashboard" className="block py-2 px-4 rounded bg-primary text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/dashboard/events" className="block py-2 px-4 rounded hover:bg-gray-100">
                      My Events
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/dashboard/bookings" className="block py-2 px-4 rounded hover:bg-gray-100">
                      My Bookings
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/dashboard/profile" className="block py-2 px-4 rounded hover:bg-gray-100">
                      Profile Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4 px-4">
            <div className="bg-white shadow-md rounded-lg p-8">
              <h1 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name}!</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Start Planning Your Event</h3>
                  <p className="mb-4">Create a new event or browse our vendor listings to get started.</p>
                  <Link href="/events/create" className="inline-block bg-white text-blue-600 py-2 px-4 rounded shadow hover:bg-gray-100">
                    Create Event
                  </Link>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Find Local Vendors</h3>
                  <p className="mb-4">Discover top-rated vendors in your area for your next event.</p>
                  <Link href="/vendors" className="inline-block bg-white text-purple-600 py-2 px-4 rounded shadow hover:bg-gray-100">
                    Browse Vendors
                  </Link>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">You don't have any upcoming events yet.</p>
                  <Link href="/events/create" className="inline-block mt-4 text-accent hover:underline">
                    Create your first event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 