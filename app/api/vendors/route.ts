import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Filter params
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const priceParam = searchParams.get('price') || undefined;
    
    // Use raw SQL query to handle lowercase column names
    let vendorsQuery = `
      SELECT v.* 
      FROM "Vendor" v
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    
    if (category) {
      vendorsQuery += ` AND v.category = $${queryParams.length + 1}`;
      queryParams.push(category);
    }
    
    if (location) {
      vendorsQuery += ` AND v.location ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${location}%`);
    }
    
    if (priceParam) {
      if (priceParam.includes('-')) {
        // Range like "1000-5000"
        const [minPrice, maxPrice] = priceParam.split('-').map(Number);
        vendorsQuery += ` AND v.minprice <= $${queryParams.length + 1} AND v.maxprice >= $${queryParams.length + 2}`;
        queryParams.push(maxPrice, minPrice);
      } else if (priceParam.endsWith('+')) {
        // Range like "10000+"
        const minValue = parseInt(priceParam.replace('+', ''));
        vendorsQuery += ` AND v.maxprice >= $${queryParams.length + 1}`;
        queryParams.push(minValue);
      } else if (priceParam.startsWith('Under $')) {
        // Range like "Under $1,000"
        const maxValue = parseInt(priceParam.replace('Under $', '').replace(/,/g, ''));
        vendorsQuery += ` AND v.maxprice <= $${queryParams.length + 1}`;
        queryParams.push(maxValue);
      }
    }
    
    // Add ordering and pagination
    vendorsQuery += ` ORDER BY v.rating DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, skip);
    
    console.log('Executing vendors query:', vendorsQuery, queryParams);
    
    // Execute the raw query
    // const vendors = await prisma.$queryRawUnsafe<any[]>(vendorsQuery, ...queryParams);
    const vendors = await prisma.$queryRawUnsafe<any[]>(vendorsQuery, ...queryParams);
    
    // Count total vendors (for pagination)
    let countQuery = vendorsQuery.replace('SELECT v.*', 'SELECT COUNT(*)');
    countQuery = countQuery.substring(0, countQuery.indexOf('ORDER BY'));
    
    const totalResult = await prisma.$queryRawUnsafe<any[]>(countQuery, ...queryParams.slice(0, -2));
    const totalVendors = parseInt(totalResult[0].count || '0');
    
    console.log(`Found ${vendors.length} vendors out of ${totalVendors} total`);
    
    // Format the vendors data with proper camelCase field names for the frontend
    const formattedVendors = vendors.map((vendor: any) => {
      return {
        id: vendor.id,
        businessName: vendor.businessname || 'Unknown Business',
        category: vendor.category || 'OTHER',
        location: vendor.location || 'Unknown Location',
        minPrice: vendor.minprice || 0,
        maxPrice: vendor.maxprice || 0,
        rating: vendor.rating || 0,
        description: vendor.description || 'No description available',
        profileImg: vendor.profileimg || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'
      };
    });
    
    return NextResponse.json({
      vendors: formattedVendors,
      pagination: {
        total: totalVendors,
        page,
        limit,
        totalPages: Math.ceil(totalVendors / limit),
        hasMore: page * limit < totalVendors
      }
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 