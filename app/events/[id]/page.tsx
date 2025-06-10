'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import Image from 'next/image';
import Link from 'next/link';

// Types
interface Vendor {
  id: string;
  businessName: string;
  category: string;
  location: string;
  profileImg: string;
  agreedPrice: number;
  status: string;
  service: string;
}

interface Event {
  id: string;
  eventType: string;
  location: string;
  date: string;
  budget: number;
  vendors: Vendor[];
  progress: number;
  user: {
    fullName: string;
    email: string;
  };
}

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/events/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch event: ${response.status}`);
        }
        
        const eventData = await response.json();
        
        // Log the event data for debugging
        console.log('Fetched event data:', eventData);
        
        if (!eventData || !eventData.id) {
          throw new Error('Invalid event data received');
        }
        
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return notFound();
  }

  // Ensure all required properties are present with fallbacks
  const safeEvent = {
    ...event,
    eventType: event.eventType || 'Unknown Event Type',
    location: event.location || 'Unknown Location',
    date: event.date || new Date().toISOString(),
    budget: event.budget || 0,
    vendors: event.vendors || [],
    progress: event.progress || 0,
    user: event.user || { fullName: 'Unknown User', email: 'unknown@example.com' }
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'CONFIRMED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'PENDING':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {safeEvent.eventType} in {safeEvent.location}
                </h1>
                <p className="text-gray-600">
                  <span className="mr-3">
                    <svg className="w-5 h-5 inline-block mr-1 text-accent-DEFAULT" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(safeEvent.date)}
                  </span>
                  <span>
                    <svg className="w-5 h-5 inline-block mr-1 text-accent-DEFAULT" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {safeEvent.location}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Total Budget</h3>
                <p className="text-2xl font-bold text-gray-900">{formatBudget(safeEvent.budget)}</p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-accent-DEFAULT text-accent-DEFAULT'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('vendors')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'vendors'
                      ? 'border-b-2 border-accent-DEFAULT text-accent-DEFAULT'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Vendors ({safeEvent.vendors.length})
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'details'
                      ? 'border-b-2 border-accent-DEFAULT text-accent-DEFAULT'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Event Details
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Event Overview</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Event Host</h3>
                      <div className="flex items-start">
                        <div className="bg-accent-light rounded-full w-12 h-12 flex items-center justify-center text-accent-dark font-bold text-xl mr-4">
                          {safeEvent.user.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{safeEvent.user.fullName}</h4>
                          <p className="text-gray-600">{safeEvent.user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Budget Breakdown</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {safeEvent.vendors.map((vendor) => (
                          <div key={vendor.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 relative">
                                <Image
                                  src={vendor.profileImg}
                                  alt={vendor.businessName}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{vendor.businessName}</h4>
                                <p className="text-sm text-gray-500">{vendor.service || vendor.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatBudget(vendor.agreedPrice || 0)}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                                {getStatusIcon(vendor.status)}
                                <span className="ml-1">{vendor.status}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vendors' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Vendors</h2>
                    <Link 
                      href="/vendors" 
                      className="bg-accent-DEFAULT hover:bg-accent-dark text-white px-4 py-2 rounded-md transition flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Vendor
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {safeEvent.vendors.map((vendor) => (
                      <div key={vendor.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                        <div className="relative h-48 w-full">
                          <Image
                            src={vendor.profileImg}
                            alt={vendor.businessName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                              {getStatusIcon(vendor.status)}
                              <span className="ml-1">{vendor.status}</span>
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-1">{vendor.businessName}</h3>
                          <p className="text-gray-500 mb-2">{vendor.service || vendor.category}</p>
                          <p className="text-gray-600 mb-3">
                            <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {vendor.location}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-bold text-accent-DEFAULT">{formatBudget(vendor.agreedPrice || 0)}</span>
                            <Link 
                              href={`/vendors/${vendor.id}`} 
                              className="text-accent-DEFAULT hover:text-accent-dark font-medium"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Event Information</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm uppercase text-gray-500 font-medium">Event Type</h4>
                            <p className="font-medium text-gray-900">{safeEvent.eventType}</p>
                          </div>
                          <div>
                            <h4 className="text-sm uppercase text-gray-500 font-medium">Date</h4>
                            <p className="font-medium text-gray-900">{formatDate(safeEvent.date)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm uppercase text-gray-500 font-medium">Location</h4>
                            <p className="font-medium text-gray-900">{safeEvent.location}</p>
                          </div>
                          <div>
                            <h4 className="text-sm uppercase text-gray-500 font-medium">Budget</h4>
                            <p className="font-medium text-gray-900">{formatBudget(safeEvent.budget)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Actions</h3>
                        <div className="space-y-4">
                          <button className="w-full bg-accent-DEFAULT hover:bg-accent-dark text-white px-4 py-2 rounded-md transition flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            Edit Event Details
                          </button>
                          
                          <Link 
                            href="/vendors" 
                            className="w-full bg-white border border-accent-DEFAULT text-accent-DEFAULT hover:bg-accent-light px-4 py-2 rounded-md transition flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Vendor
                          </Link>
                          
                          <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md transition flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                              <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                            </svg>
                            Share Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 