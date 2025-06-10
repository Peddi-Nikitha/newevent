'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import Link from 'next/link';

export default function VendorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal info
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Business info
    businessName: '',
    category: 'PHOTOGRAPHY',
    location: '',
    description: '',
    minPrice: '',
    maxPrice: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Validation for step 1
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError('All fields are required');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    }
    
    setError('');
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for step 2
    if (!formData.businessName || !formData.category || !formData.location || !formData.description) {
      setError('All fields are required');
      return;
    }
    
    if (formData.minPrice === '' || formData.maxPrice === '') {
      setError('Please enter your price range');
      return;
    }
    
    const minPrice = parseInt(formData.minPrice);
    const maxPrice = parseInt(formData.maxPrice);
    
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      setError('Price must be a number');
      return;
    }
    
    if (minPrice > maxPrice) {
      setError('Minimum price cannot be greater than maximum price');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/register/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          businessName: formData.businessName,
          category: formData.category,
          location: formData.location,
          description: formData.description,
          minPrice: parseInt(formData.minPrice),
          maxPrice: parseInt(formData.maxPrice),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Registration successful, redirect to login
      router.push('/login?registered=true&vendor=true');
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Become a Vendor</h1>
          
          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 1 ? 'bg-accent text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className="h-1 w-20 bg-gray-200 mx-2"></div>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 2 ? 'bg-accent text-white' : 'bg-gray-200'}`}>
                2
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit} className="bg-white shadow-md rounded-lg p-8">
            {step === 1 ? (
              <>
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                
                <div className="mb-4">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary py-3 px-6"
                  >
                    Next Step
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-6">Business Information</h2>
                
                <div className="mb-4">
                  <label htmlFor="businessName" className="form-label">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Your Business Name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="category" className="form-label">Business Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="PHOTOGRAPHY">Photography</option>
                    <option value="CATERING">Catering</option>
                    <option value="MUSIC">Music & Entertainment</option>
                    <option value="VENUE">Venue</option>
                    <option value="DECORATION">Decoration</option>
                    <option value="CAKE">Cakes & Desserts</option>
                    <option value="FLOWERS">Flowers</option>
                    <option value="DRESS">Attire & Clothing</option>
                    <option value="MAKEUP">Hair & Makeup</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="City, State"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Business Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input h-32"
                    placeholder="Describe your services, experience, and what makes your business unique..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex mb-6 space-x-4">
                  <div className="flex-1">
                    <label htmlFor="minPrice" className="form-label">Minimum Price ($)</label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      value={formData.minPrice}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="maxPrice" className="form-label">Maximum Price ($)</label>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      value={formData.maxPrice}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="1000"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="termsCheck"
                      className="mr-2"
                      required
                    />
                    <label htmlFor="termsCheck" className="text-sm text-gray-600">
                      I agree to the <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-secondary py-3 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary py-3 px-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </>
            )}
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-accent hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
} 