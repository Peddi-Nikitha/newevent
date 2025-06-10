'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '../components/layout/MainLayout';
import { useRouter } from 'next/navigation';

// Types
interface Vendor {
  id: string;
  businessName: string;
  category: string;
  location: string;
  rating: number;
  profileImg: string;
  priceRange: string;
}

interface Event {
  id: string;
  eventType: string;
  location: string;
  date: string;
}

// Vendor category data
const vendorCategories = [
  { 
    id: 'photography',
    name: 'Photography', 
    priceRange: '$500 - $3000',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'catering',
    name: 'Catering', 
    priceRange: '$1000 - $5000',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'venue',
    name: 'Venue', 
    priceRange: '$1000 - $10000',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'decor',
    name: 'Decor & Flowers', 
    priceRange: '$400 - $5000',
    image: 'https://images.unsplash.com/photo-1561128290-99e8b8e14e6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'dj-entertainment',
    name: 'DJ Entertainment', 
    priceRange: '$500 - $3000',
    image: 'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'videography',
    name: 'Videography', 
    priceRange: '$1000 - $8000',
    image: 'https://images.unsplash.com/photo-1569708334011-d3d8165d18b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'makeup',
    name: 'Makeup', 
    priceRange: '$100 - $600',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 'hair-styling',
    name: 'Hair & Styling', 
    priceRange: '$100 - $500',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [eventType, setEventType] = useState('Wedding');
  const [budget, setBudget] = useState('$500 - $3000');
  const [location, setLocation] = useState('NYC');
  
  // Testimonials data
  const testimonials = [
    { 
      id: 1, 
      name: 'Sarah J.', 
      event: 'Wedding',
      quote: "I've saved planning countless hours with this site! Their vendor selection is perfect, helped me find my dream photographer within budget.",
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    { 
      id: 2, 
      name: 'Michael T.', 
      event: 'Corporate Event',
      quote: 'As someone who plans events quarterly for our company, this platform has been a game-changer. The vendor selection is excellent.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    },
    { 
      id: 3, 
      name: 'Priya M.', 
      event: 'Birthday Party',
      quote: 'I planned my daughter\'s 16th birthday through this site and everything was perfect! Will definitely use again.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock featured vendors - in a real app, this would be an API call
        const mockVendors: Vendor[] = [
          {
            id: 'v1',
            businessName: 'Perfect Shots Photography',
            category: 'PHOTOGRAPHY',
            location: 'New York, NY',
            rating: 4.8,
            priceRange: '$800 - $2500',
            profileImg: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e'
          },
          {
            id: 'v2',
            businessName: 'Elegant Events Hall',
            category: 'VENUE',
            location: 'Chicago, IL',
            rating: 4.9,
            priceRange: '$3000 - $8000',
            profileImg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'
          },
          {
            id: 'v3',
            businessName: 'Elite Sound Entertainment',
            category: 'MUSIC',
            location: 'Miami, FL',
            rating: 4.5,
            priceRange: '$500 - $1500',
            profileImg: 'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2'
          },
          {
            id: 'v4',
            businessName: 'Delicious Bites Catering',
            category: 'CATERING',
            location: 'Los Angeles, CA',
            rating: 4.6,
            priceRange: '$1200 - $4500',
            profileImg: 'https://images.unsplash.com/photo-1555244162-803834f70033'
          }
        ];
        
        setFeaturedVendors(mockVendors);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const handleSearch = () => {
    // Convert budget to a price range format the vendors page will understand
    let priceRange = '';
    if (budget === '$500 - $3000') priceRange = '500-3000';
    else if (budget === '$3000 - $5000') priceRange = '3000-5000';
    else if (budget === '$5000 - $10000') priceRange = '5000-10000';
    else if (budget === '$10000+') priceRange = '10000+';
    
    router.push(`/vendors?location=${location}&price=${priceRange}`);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-accent-light py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading-primary">Plan Your Dream Event – Within Your Budget</h2>
            <p className="text-lg text-text-light mb-8">Customize everything from flowers to venue and find the best vendors near you.</p>
          </div>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Event Type</label>
                <select 
                  className="border border-gray-300 rounded p-2 text-text-dark"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Budget</label>
                <select 
                  className="border border-gray-300 rounded p-2 text-text-dark"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option>$500 - $3000</option>
                  <option>$3000 - $5000</option>
                  <option>$5000 - $10000</option>
                  <option>$10000+</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Location</label>
                <select 
                  className="border border-gray-300 rounded p-2 text-text-dark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>NYC</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                  <option>Miami</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={handleSearch}
                  className="bg-cta-primary hover:bg-cta-hover text-white py-2 px-4 rounded w-full font-bold shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  Search Vendors
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-heading-primary">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cta-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-heading-primary">Enter Your Plan & Preferences</h3>
              <p className="text-text-light">Tell us about your event details and budget</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cta-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-heading-primary">Pick the Vendors You Like</h3>
              <p className="text-text-light">Browse profiles and choose your favorites</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cta-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-heading-primary">Get Event Guide & Tools</h3>
              <p className="text-text-light">Receive planning assistance and budgeting tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Categories */}
      <section className="py-16 px-4 bg-accent-light">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-heading-primary">Choose Vendor Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {vendorCategories.slice(0, 4).map((category) => (
              <Link
                href={`/vendors?category=${category.id.toUpperCase()}`}
                key={category.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image 
                    src={category.image} 
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-heading-primary">{category.name}</h3>
                  <p className="text-sm text-text-light">{category.priceRange}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {vendorCategories.slice(4).map((category) => (
              <Link
                href={`/vendors?category=${category.id.toUpperCase()}`}
                key={category.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image 
                    src={category.image} 
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-heading-primary">{category.name}</h3>
                  <p className="text-sm text-text-light">{category.priceRange}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Summary & Reviews Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Budget Summary */}
            <div className="bg-accent-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-heading-primary">Live Budget Summary</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-text-dark">Estimated total</span>
                  <span className="font-bold text-text-dark">Budget: $8000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-cta-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <p className="text-sm text-text-light mb-4">70% budget used</p>
              <button className="bg-cta-primary hover:bg-cta-hover text-white py-2 px-4 rounded-lg transition-colors w-full font-bold shadow-md">
                Download Quote
              </button>
            </div>
            
            {/* Customer Reviews */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-heading-primary">Customer Reviews</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {renderRatingStars(5)}
                  </div>
                  <span className="ml-2 text-text-light">Recent • 41 reviews</span>
                </div>
                <div className="mb-4">
                  <p className="text-text-dark italic">"{testimonials[activeTestimonial].quote}"</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image 
                      src={testimonials[activeTestimonial].image} 
                      alt={testimonials[activeTestimonial].name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-heading-primary">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-text-light">{testimonials[activeTestimonial].event} • Saved 30% on her budget planning!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 bg-accent">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-heading-primary">Ready to Start Planning Your Event?</h2>
          <Link href="/register" className="inline-block bg-cta-primary hover:bg-cta-hover text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            Get Started Today
          </Link>
        </div>
      </section>
    </MainLayout>
  );
} 