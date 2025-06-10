'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../../components/layout/MainLayout';

interface Booking {
  id: string;
  vendorName: string;
  serviceName: string;
  eventTitle: string;
  date: string;
  price: number;
  status: string;
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // Fetch user's bookings
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      // This would be an API call in a real application
      // For now, we'll use mock data
      const mockBookings: Booking[] = [
        {
          id: '1',
          vendorName: 'Elegant Catering',
          serviceName: 'Full Service Catering',
          eventTitle: 'Birthday Party',
          date: '2023-12-15',
          price: 1200,
          status: 'CONFIRMED',
        },
        {
          id: '2',
          vendorName: 'Premium Photography',
          serviceName: 'Event Photography Package',
          eventTitle: 'Corporate Retreat',
          date: '2024-02-10',
          price: 800,
          status: 'PENDING',
        },
      ];
      
      setBookings(mockBookings);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setLoading(false);
    }
  };

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
                    <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-100">
                      Dashboard
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/dashboard/events" className="block py-2 px-4 rounded hover:bg-gray-100">
                      My Events
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/dashboard/bookings" className="block py-2 px-4 rounded bg-primary text-white">
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
              <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
              
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Vendor</th>
                        <th className="px-4 py-2 text-left">Service</th>
                        <th className="px-4 py-2 text-left">Event</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="px-4 py-3">{booking.vendorName}</td>
                          <td className="px-4 py-3">{booking.serviceName}</td>
                          <td className="px-4 py-3">{booking.eventTitle}</td>
                          <td className="px-4 py-3">
                            {new Date(booking.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${booking.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              booking.status === 'CONFIRMED' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.status === 'PENDING' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : booking.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link 
                              href={`/dashboard/bookings/${booking.id}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">You don't have any bookings yet</h3>
                  <p className="text-gray-500 mb-6">Browse vendors and book services for your events.</p>
                  <Link href="/vendors" className="btn btn-primary">
                    Find Vendors
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 