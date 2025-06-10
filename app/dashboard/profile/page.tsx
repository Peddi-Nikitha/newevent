'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user) {
      setFormData({
        ...formData,
        fullName: session.user.name || '',
        email: session.user.email || '',
        phone: '',
      });
      setLoading(false);
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.fullName,
        },
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
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
                    <Link href="/dashboard/bookings" className="block py-2 px-4 rounded hover:bg-gray-100">
                      My Bookings
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/dashboard/profile" className="block py-2 px-4 rounded bg-primary text-white">
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
              <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
              
              {message.text && (
                <div 
                  className={`p-4 mb-6 rounded ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-700 border border-green-400' 
                      : 'bg-red-100 text-red-700 border border-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-input"
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
                        className="form-input bg-gray-100"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className={`btn btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
                
                {/* Password Change */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="form-label">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                        minLength={8}
                      />
                      <p className="text-sm text-gray-500 mt-1">At least 8 characters</p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className={`btn btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={saving}
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 