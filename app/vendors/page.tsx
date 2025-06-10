'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import Link from 'next/link';
import Image from 'next/image';

// Types
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
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'PHOTOGRAPHY', label: 'Photography' },
  { value: 'CATERING', label: 'Catering' },
  { value: 'MUSIC', label: 'Music & Entertainment' },
  { value: 'VENUE', label: 'Venues' },
  { value: 'DECORATION', label: 'Decoration' },
  { value: 'CAKE', label: 'Cakes & Desserts' },
  { value: 'FLOWERS', label: 'Flowers' },
  { value: 'DRESS', label: 'Dresses & Attire' },
  { value: 'MAKEUP', label: 'Makeup & Beauty' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'OTHER', label: 'Other Services' },
];

const priceRangeOptions = [
  { value: '', label: 'Any Price Range' },
  { value: '0-1000', label: 'Under $1,000' },
  { value: '1000-2500', label: '$1,000 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000+', label: '$10,000+' },
];

export default function VendorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('price') || '');
  
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (location) params.set('location', location);
        if (priceRange) params.set('price', priceRange);
        
        // Fetch vendors from the API
        const response = await fetch(`/api/vendors?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        
        const data = await response.json();
        setVendors(data.vendors);
        
      } catch (error) {
        console.error('Error fetching vendors:', error);
        // Fallback to empty array if error occurs
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, [category, location, priceRange]);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (priceRange) params.set('price', priceRange);
    
    router.push(`/vendors?${params.toString()}`);
  };
  
  const formatPriceRange = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    
    return `${formatter.format(min)} - ${formatter.format(max)}`;
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
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-heading-primary">Find Vendors</h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block text-text-light mb-2">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {categoryOptions.map((option) => (
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
              <label htmlFor="priceRange" className="block text-text-light mb-2">Price Range</label>
              <select
                id="priceRange"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {priceRangeOptions.map((option) => (
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
              Search Vendors
            </button>
          </div>
        </div>
        
        {/* Vendors List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cta-primary"></div>
            <p className="mt-2 text-text-light">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
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
            <h3 className="text-xl font-bold mb-2 text-heading-primary">No vendors found</h3>
            <p className="text-text-light mb-6">Try adjusting your search criteria</p>
            <button 
              onClick={() => {
                setCategory('');
                setLocation('');
                setPriceRange('');
                router.push('/vendors');
              }}
              className="text-cta-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <Link 
                href={`/vendors/${vendor.id}`} 
                key={vendor.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image 
                    src={vendor.profileImg} 
                    alt={vendor.businessName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-accent-light m-2 px-3 py-1 rounded-lg">
                    <span className="text-xs font-bold text-heading-primary">{vendor.category.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-heading-primary mb-1">{vendor.businessName}</h2>
                  <p className="text-text-light mb-2">{vendor.location}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderRatingStars(vendor.rating)}
                    </div>
                    <span className="text-sm text-text-light">({vendor.rating.toFixed(1)})</span>
                  </div>
                  
                  <p className="text-sm text-text-dark mb-3 line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cta-primary font-medium">
                      {formatPriceRange(vendor.minPrice, vendor.maxPrice)}
                    </span>
                    <span className="text-cta-primary hover:underline">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 