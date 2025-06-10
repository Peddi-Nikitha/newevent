'use client';

import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout';

export default function HowItWorks() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-accent-light py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-heading-primary sm:text-5xl sm:tracking-tight lg:text-6xl">
              How It Works
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-text-light">
              Plan your perfect event with ease using our platform
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-heading-primary sm:text-4xl">
              Three Simple Steps
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-text-light">
              Our platform makes event planning straightforward and stress-free
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-24">
              {/* Step 1 */}
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden bg-accent-light flex items-center justify-center p-8">
                    <div className="text-8xl text-cta-primary">1</div>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-7">
                  <h3 className="text-2xl font-bold text-heading-primary">
                    Create Your Event
                  </h3>
                  <p className="mt-3 text-lg text-text-light">
                    Start by creating your event. Specify the type of event, date, location, and budget. Our platform will help you organize everything in one place.
                  </p>
                  <div className="mt-8">
                    <Link href="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cta-primary hover:bg-cta-hover transition-all duration-300">
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-7 order-last lg:order-first">
                  <h3 className="text-2xl font-bold text-heading-primary">
                    Find and Book Vendors
                  </h3>
                  <p className="mt-3 text-lg text-text-light">
                    Browse our marketplace of trusted vendors. Filter by category, price range, and availability. Compare options, read reviews, and book the perfect vendors for your event.
                  </p>
                  <div className="mt-8">
                    <Link href="/vendors" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cta-primary hover:bg-cta-hover transition-all duration-300">
                      Explore Vendors
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden bg-accent-light flex items-center justify-center p-8">
                    <div className="text-8xl text-cta-primary">2</div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden bg-accent-light flex items-center justify-center p-8">
                    <div className="text-8xl text-cta-primary">3</div>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-7">
                  <h3 className="text-2xl font-bold text-heading-primary">
                    Manage Your Event
                  </h3>
                  <p className="mt-3 text-lg text-text-light">
                    Track all your bookings, communicate with vendors, and manage your budget in your personalized dashboard. Everything you need is in one place, making planning your event simple and enjoyable.
                  </p>
                  <div className="mt-8">
                    <Link href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cta-primary hover:bg-cta-hover transition-all duration-300">
                      View Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Events Section */}
      <div className="py-16 bg-accent-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-heading-primary sm:text-4xl">
              Perfect for Any Event
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-text-light">
              From weddings to corporate gatherings, our platform helps with all event types
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Wedding */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622" 
                  alt="Wedding" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading-primary mb-2">Weddings</h3>
                <p className="text-text-light mb-4">Create the perfect wedding day with our curated vendors and budgeting tools.</p>
                <Link href="/vendors?event=WEDDING" className="text-cta-primary hover:underline font-medium">
                  Find wedding vendors →
                </Link>
              </div>
            </div>
            
            {/* Corporate */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6" 
                  alt="Corporate Event" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading-primary mb-2">Corporate Events</h3>
                <p className="text-text-light mb-4">Plan professional corporate events with reliable, experienced vendors.</p>
                <Link href="/vendors?event=CORPORATE" className="text-cta-primary hover:underline font-medium">
                  Find corporate vendors →
                </Link>
              </div>
            </div>
            
            {/* Birthday */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1464349153735-7db50ed83c84" 
                  alt="Birthday" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading-primary mb-2">Birthdays & Celebrations</h3>
                <p className="text-text-light mb-4">Create memorable celebrations with the right entertainment and catering.</p>
                <Link href="/vendors?event=BIRTHDAY" className="text-cta-primary hover:underline font-medium">
                  Find party vendors →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-heading-primary sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="bg-accent-light rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <div className="flex">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <svg 
                    key={i} 
                    className="h-5 w-5 text-yellow-400" 
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-lg italic mt-4 text-text-dark">
              "I've saved countless planning hours with this site! Their vendor selection is perfect, helped me find my dream photographer within budget. The dashboard made managing everything so easy!"
            </p>
            <div className="mt-6 flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                  alt="Sarah J."
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-heading-primary">Sarah J.</p>
                <p className="text-sm text-text-light">Wedding, June 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent-dark py-12">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8 lg:flex lg:items-center lg:justify-between max-w-6xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-accent-light">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-cta-primary bg-white hover:bg-accent-light transition-all duration-300">
                Sign up for free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cta-primary hover:bg-cta-hover transition-all duration-300">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 