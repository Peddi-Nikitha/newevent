import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filter params
    const eventType = searchParams.get('type') || undefined;
    const location = searchParams.get('location') || undefined;
    const budgetParam = searchParams.get('budget') || undefined;
    
    // Use raw SQL query to ensure we can handle different column naming conventions
    let eventsQuery = `
      SELECT e.id, e.* 
      FROM "Event" e
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    
    if (eventType) {
      eventsQuery += ` AND e."eventtype" = $${queryParams.length + 1}`;
      queryParams.push(eventType);
    }
    
    if (location) {
      eventsQuery += ` AND e.location ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${location}%`);
    }
    
    if (budgetParam) {
      const [minBudget, maxBudget] = budgetParam.split('-').map(Number);
      
      if (maxBudget) {
        // Range like "5000-10000"
        eventsQuery += ` AND e.budget >= $${queryParams.length + 1} AND e.budget <= $${queryParams.length + 2}`;
        queryParams.push(minBudget, maxBudget);
      } else if (budgetParam.endsWith('+')) {
        // Range like "20000+"
        const minValue = parseInt(budgetParam.replace('+', ''));
        eventsQuery += ` AND e.budget >= $${queryParams.length + 1}`;
        queryParams.push(minValue);
      }
    }
    
    // Add ordering and pagination
    eventsQuery += ` ORDER BY e.date DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, skip);
    
    console.log('Executing query:', eventsQuery, queryParams);
    
    // Execute the raw query
    const events: any[] = await prisma.$queryRawUnsafe(eventsQuery, ...queryParams);
    
    // Count total events (for pagination)
    let countQuery = eventsQuery.replace('SELECT e.id, e.*', 'SELECT COUNT(*)');
    countQuery = countQuery.substring(0, countQuery.indexOf('ORDER BY'));
    
    const totalResult: any[] = await prisma.$queryRawUnsafe(countQuery, ...queryParams.slice(0, -2));
    const totalEvents = parseInt(totalResult[0].count || '0');
    
    console.log(`Found ${events.length} events out of ${totalEvents} total`);
    
    // Format the events data
    const formattedEvents = events.map((event: any) => {
      // Log the event object to see all available properties
      console.log('Event data from DB:', Object.keys(event));
      
      // Try to find the correct event type field (now we know it's lowercase 'eventtype')
      let eventType = event.eventtype || 'Unknown';
      
      return {
        id: event.id,
        eventType: eventType,
        location: event.location || 'Unknown',
        date: event.date ? new Date(event.date).toISOString() : new Date().toISOString(),
        budget: event.budget || 0,
        imageUrl: event.imageUrl || null,
        // We don't fetch vendors in this simplified version to ensure compatibility
        vendors: []
      };
    });
    
    return NextResponse.json({
      events: formattedEvents,
      pagination: {
        total: totalEvents,
        page,
        limit,
        totalPages: Math.ceil(totalEvents / limit),
        hasMore: page * limit < totalEvents
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 