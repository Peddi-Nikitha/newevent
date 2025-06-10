'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import Link from 'next/link';
import Image from 'next/image';

// Types
interface Event {
  id: string;
  eventType: string;
  location: string;
  date: string;
  budget: number;
  imageUrl: string;
  vendors: {
    id: string;
    businessName: string;
    category: string;
    profileImg: string;
    service?: {
      id: string;
      title: string;
      price: number;
    };
  }[];
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

const eventTypeOptions = [
  { value: '', label: 'All Event Types' },
  { value: 'WEDDING', label: 'Wedding' },
  { value: 'BIRTHDAY', label: 'Birthday' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'BABY_SHOWER', label: 'Baby Shower' },
  { value: 'ANNIVERSARY', label: 'Anniversary' },
  { value: 'GRADUATION', label: 'Graduation' },
  { value: 'HOLIDAY', label: 'Holiday' },
  { value: 'OTHER', label: 'Other' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'SEMINAR', label: 'Seminar' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'GALA', label: 'Gala' },
  { value: 'FUNDRAISER', label: 'Fundraiser' },
  { value: 'SPORTING_EVENT', label: 'Sporting Event' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'TRADE_SHOW', label: 'Trade Show' },
  { value: 'ART_EXHIBITION', label: 'Art Exhibition' },
  { value: 'MUSIC_CONCERT', label: 'Music Concert' },
];

const budgetOptions = [
  { value: '', label: 'Any Budget' },
  { value: '1000-5000', label: '$1,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-20000', label: '$10,000 - $20,000' },
  { value: '20000+', label: '$20,000+' },
];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [eventType, setEventType] = useState<string>(searchParams.get('type') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [budget, setBudget] = useState<string>(searchParams.get('budget') || '');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  // Reference to detect when user scrolls near bottom
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const fetchEvents = useCallback(async (page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '10');
      
      if (eventType) params.set('type', eventType);
      if (location) params.set('location', location);
      if (budget) params.set('budget', budget);
      
      // Fetch events from API
      const response = await fetch(`/api/events?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      if (isLoadMore) {
        setEvents(prevEvents => [...prevEvents, ...data.events]);
      } else {
        setEvents(data.events);
      }
      
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [eventType, location, budget]);
  
  // Initial data fetch
  useEffect(() => {
    fetchEvents(1, false);
  }, [fetchEvents]);
  
  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        
        if (entry.isIntersecting && pagination?.hasMore && !loadingMore) {
          fetchEvents(currentPage + 1, true);
        }
      },
      { rootMargin: '100px' }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [pagination, loadingMore, currentPage, fetchEvents]);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (eventType) params.set('type', eventType);
    if (location) params.set('location', location);
    if (budget) params.set('budget', budget);
    
    router.push(`/events?${params.toString()}`);
    
    // Reset to first page and fetch results
    setCurrentPage(1);
    fetchEvents(1, false);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-heading-primary">Explore Events</h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="eventType" className="block text-text-light mb-2">Event Type</label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {eventTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-text-light mb-2">Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            
            <div>
              <label htmlFor="budget" className="block text-text-light mb-2">Budget</label>
              <select
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleSearch}
              className="bg-cta-primary hover:bg-cta-hover text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Search Events
            </button>
          </div>
        </div>
        
        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cta-primary"></div>
            <p className="mt-2 text-text-light">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-accent-dark mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-heading-primary">No events found</h3>
            <p className="text-text-light mb-6">Try adjusting your search criteria</p>
            <button 
              onClick={() => {
                setEventType('');
                setLocation('');
                setBudget('');
                router.push('/events');
              }}
              className="text-cta-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Link 
                  href={`/events/${event.id}`} 
                  key={event.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
                >
                  <div className="relative w-full h-48">
                    <Image 
                      src={event.imageUrl} 
                      alt={event.eventType} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-heading-primary mb-1">
                          {event.eventType.replace('_', ' ')} Event
                        </h2>
                        <p className="text-text-light">{event.location}</p>
                      </div>
                      <div className="bg-accent-light text-heading-primary text-sm font-bold px-3 py-1 rounded-lg">
                        {formatBudget(event.budget)}
                      </div>
                    </div>
                    
                    <p className="text-cta-primary font-medium mb-4">{formatDate(event.date)}</p>
                    
                    {event.vendors.length > 0 && (
                      <div>
                        <h3 className="text-sm text-text-light mb-2">Featured Vendors:</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.vendors.slice(0, 3).map((vendor) => (
                            <div 
                              key={vendor.id} 
                              className="flex items-center bg-accent-light rounded-full px-3 py-1"
                            >
                              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                <Image 
                                  src={vendor.profileImg} 
                                  alt={vendor.businessName}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm text-text-dark">{vendor.businessName}</span>
                            </div>
                          ))}
                          {event.vendors.length > 3 && (
                            <div className="bg-accent-light rounded-full px-3 py-1">
                              <span className="text-sm text-text-dark">+{event.vendors.length - 3} more</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 text-right">
                      <span className="text-cta-primary font-medium hover:underline">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Loading more indicator and intersection observer target */}
            <div ref={observerTarget} className="h-10 mt-8 text-center">
              {loadingMore && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cta-primary mr-3"></div>
                  <p className="text-text-light">Loading more events...</p>
                </div>
              )}
            </div>
            
            {/* Show pagination info */}
            {pagination && !loadingMore && (
              <div className="mt-6 text-center text-text-light">
                Showing {events.length} of {pagination.total} events
                {!pagination.hasMore && events.length > 0 && (
                  <p className="mt-2">You've reached the end of the list</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
} 