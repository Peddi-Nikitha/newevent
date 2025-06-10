import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import SessionProvider from '../components/auth/SessionProvider';
import React from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Happy Happenings | Event Planning Made Simple',
  description: 'Plan your dream event — your budget, your way. Select top-rated local vendors for birthdays, weddings, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
} 