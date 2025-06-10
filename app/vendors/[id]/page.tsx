'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import Image from 'next/image';
import Link from 'next/link';

// Types
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface Review {
  id: string;
  rating: number;
  reviewText: string;
  user: {
    fullName: string;
  };
  createdAt: string;
}

interface Vendor {
  id: string;
  businessName: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  description: string;
  profileImg: string;
  services: Service[];
  reviews: Review[];
}

export default function VendorProfile({ params }: { params: { id: string } }) {
  const { id } = params;
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('services');

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/vendors/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch vendor');
        }
        
        const vendorData = await response.json();
        setVendor(vendorData);
      } catch (error) {
        console.error('Error fetching vendor:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
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

  if (!vendor) {
    return notFound();
  }

  const formatPriceRange = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Hero section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative h-80 w-full">
              <Image 
                src={vendor.profileImg}
                alt={vendor.businessName}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{vendor.businessName}</h1>
                <div className="flex items-center mb-2">
                  {renderRatingStars(vendor.rating)}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 bg-accent-DEFAULT text-white rounded-full text-sm font-medium">
                    {vendor.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-medium">
                    {formatPriceRange(vendor.minPrice, vendor.maxPrice)}
                  </span>
                </div>
                <p className="text-gray-200">
                  <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {vendor.location}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'services'
                      ? 'border-b-2 border-accent-DEFAULT text-accent-DEFAULT'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'border-b-2 border-accent-DEFAULT text-accent-DEFAULT'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-accent-DEFAULT text-accent-DEFAULT'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews ({vendor.reviews.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'services' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Our Services</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {vendor.services.map((service) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-accent-DEFAULT">{formatPrice(service.price)}</span>
                          <button className="bg-accent-DEFAULT hover:bg-accent-dark text-white px-4 py-2 rounded-md transition">
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">About Us</h2>
                  <p className="text-gray-700 mb-6">{vendor.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-accent-DEFAULT mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Phone</h4>
                        <p className="text-gray-600">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-accent-DEFAULT mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Email</h4>
                        <p className="text-gray-600">contact@{vendor.businessName.toLowerCase().replace(/\s+/g, '')}.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-accent-DEFAULT mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Address</h4>
                        <p className="text-gray-600">{vendor.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-accent-DEFAULT mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Business Hours</h4>
                        <p className="text-gray-600">Monday-Friday: 9AM-7PM<br />Saturday-Sunday: 10AM-5PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    <button className="bg-accent-DEFAULT hover:bg-accent-dark text-white px-4 py-2 rounded-md transition">
                      Write a Review
                    </button>
                  </div>
                  
                  {vendor.reviews.length > 0 ? (
                    vendor.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 py-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{review.user.fullName}</h3>
                            <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.reviewText}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600">No reviews yet for this vendor.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to book {vendor.businessName} for your event?</h2>
            <p className="text-gray-600 mb-6">Contact us now to check availability and discuss your event details.</p>
            <button className="bg-accent-DEFAULT hover:bg-accent-dark text-white px-6 py-3 rounded-md text-lg font-medium transition">
              Contact Vendor
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 