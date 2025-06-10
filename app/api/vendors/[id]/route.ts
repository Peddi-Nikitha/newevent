import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getMockVendor } from './mock';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    try {
      // Use raw SQL to fetch vendor data to handle different column naming
      const vendorQuery = `
        SELECT v.* 
        FROM "Vendor" v
        WHERE v.id = $1
      `;
      
      const vendorResult = await prisma.$queryRawUnsafe<any[]>(vendorQuery, id);
      
      if (!vendorResult || vendorResult.length === 0) {
        // If no vendor is found with the ID, try to use mock data
        return NextResponse.json(getMockVendor(id));
      }
      
      const vendor = vendorResult[0];
      
      // Fetch services
      const servicesQuery = `
        SELECT s.* 
        FROM "Service" s
        WHERE s."vendorid" = $1
      `;
      
      const services = await prisma.$queryRawUnsafe<any[]>(servicesQuery, id);
      
      // Fetch reviews - simplified version without user details
      const reviewsQuery = `
        SELECT r.* 
        FROM "Review" r
        WHERE r."vendorid" = $1
        ORDER BY r."createdat" DESC
        LIMIT 5
      `;
      
      const reviews = await prisma.$queryRawUnsafe<any[]>(reviewsQuery, id);
      
      // Format the data for the frontend
      const formattedVendor = {
        id: vendor.id,
        businessname: vendor.businessname || 'Unknown Business',
        category: vendor.category || 'OTHER',
        location: vendor.location || 'Unknown Location',
        minPrice: vendor.minprice || 0,
        maxPrice: vendor.maxprice || 0,
        rating: vendor.rating || 0,
        description: vendor.description || 'No description available',
        profileImg: vendor.profileimg || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3', // Fallback image
        services: services.map((service: any) => ({
          id: service.id,
          title: service.title || 'Unknown Service',
          description: service.description || 'No description available',
          price: service.price || 0,
        })),
        reviews: reviews.map((review: any) => ({
          id: review.id,
          rating: review.rating || 5,
          reviewText: review.reviewtext || '',
          user: {
            fullname: 'Anonymous User', // Simplified version without joining user table
          },
          createdAt: review.createdat ? new Date(review.createdat).toISOString() : new Date().toISOString(),
        })),
      };

      return NextResponse.json(formattedVendor);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If there's a database error, fall back to mock data
      return NextResponse.json(getMockVendor(id));
    }
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
} 