'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../../components/layout/MainLayout';

interface Event {
  id: string;
  title: string;
  eventType: string;
  date: string;
  location: string;
  status: string;
}

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // Fetch user's events
      fetchEvents();
    }
  }, [status, router]);

  const fetchEvents = async () => {
    try {
      // This would be an API call in a real application
      // For now, we'll use mock data
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Birthday Party',
          eventType: 'BIRTHDAY',
          date: '2023-12-15',
          location: 'Home',
          status: 'PLANNING',
        },
        {
          id: '2',
          title: 'Corporate Retreat',
          eventType: 'CORPORATE',
          date: '2024-02-10',
          location: 'Mountain Resort',
          status: 'CONFIRMED',
        },
      ];
      
      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
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
                    <Link href="/dashboard/events" className="block py-2 px-4 rounded bg-primary text-white">
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                <Link href="/events/create" className="btn btn-primary">
                  Create New Event
                </Link>
              </div>
              
              {events.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Event Title</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} className="border-b">
                          <td className="px-4 py-3">
                            <Link href={`/events/${event.id}`} className="text-accent hover:underline">
                              {event.title}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            {event.eventType.charAt(0) + event.eventType.slice(1).toLowerCase()}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">{event.location}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              event.status === 'PLANNING' 
                                ? 'bg-blue-100 text-blue-800' 
                                : event.status === 'CONFIRMED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link 
                              href={`/dashboard/events/${event.id}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">You haven't created any events yet</h3>
                  <p className="text-gray-500 mb-6">Start planning your first event and find vendors to make it happen.</p>
                  <Link href="/events/create" className="btn btn-primary">
                    Create Your First Event
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