import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getMockEvent } from './mock';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    try {
      // Use raw SQL to fetch event data
      const eventQuery = `
        SELECT e.* 
        FROM "Event" e
        WHERE e.id = $1::uuid
      `;
      
      console.log(`Fetching event with ID: ${id}`);
      let eventResult: any[];
      try {
        eventResult = await prisma.$queryRawUnsafe(eventQuery, id);
        console.log(`Event query result:`, eventResult.length > 0 ? 'Found event' : 'No event found');
      } catch (eventError) {
        console.error('Error fetching event:', eventError);
        return NextResponse.json(getMockEvent(id));
      }
      
      if (!eventResult || eventResult.length === 0) {
        // If no event is found with the ID, try to use mock data
        console.log('No event found, returning mock data');
        return NextResponse.json(getMockEvent(id));
      }
      
      const event = eventResult[0];
      
      // Fetch user data
      let user = { fullname: 'Unknown User', email: 'unknown@example.com' };
      try {
        const userQuery = `
          SELECT u.fullname, u.email
          FROM "User" u
          WHERE u.id = $1::uuid
        `;
        
        console.log(`Fetching user with ID: ${event.userid}`);
        const userResult: any[] = await prisma.$queryRawUnsafe(userQuery, event.userid);
        console.log(`User query result:`, userResult.length > 0 ? 'Found user' : 'No user found');
        if (userResult.length > 0) {
          user = userResult[0];
        }
      } catch (userError) {
        console.error('Error fetching user:', userError);
        // Continue with default user values
      }
      
      // Fetch event vendors
      let vendorsResult: any[] = [];
      try {
        const vendorsQuery = `
          SELECT ev.*, v.id as vendor_id, v.businessname, v.category, v.location, v.profileimg, s.title as service_title
          FROM "EventVendor" ev
          JOIN "Vendor" v ON ev.vendorid = v.id
          JOIN "Service" s ON ev.serviceid = s.id
          WHERE ev.eventid = $1::uuid
        `;
        
        console.log(`Fetching vendors for event ID: ${id}`);
        vendorsResult = await prisma.$queryRawUnsafe(vendorsQuery, id);
        console.log(`Found ${vendorsResult.length} vendors for the event`);
      } catch (vendorsError) {
        console.error('Error fetching vendors:', vendorsError);
        // Continue with empty vendors array
      }
      
      // Calculate progress (in a real app, this would be based on tasks/milestones)
      const progress = Math.floor(Math.random() * 100);
      
      // Format the data for the frontend
      const formattedEvent = {
        id: event.id,
        eventType: event.eventtype || 'Unknown Event Type',
        location: event.location || 'Unknown Location',
        date: event.date ? new Date(event.date).toISOString() : new Date().toISOString(),
        budget: event.budget || 0,
        progress: progress,
        user: {
          fullName: user.fullname || 'Unknown User',
          email: user.email || 'unknown@example.com',
        },
        vendors: vendorsResult.map((ev: any) => ({
          id: ev.vendor_id,
          businessName: ev.businessname || 'Unknown Vendor',
          category: ev.category || 'OTHER',
          location: ev.location || 'Unknown Location',
          profileImg: ev.profileimg || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e', // Fallback image
          agreedPrice: ev.agreedprice || 0,
          status: ev.status || 'PENDING',
          service: ev.service_title || 'Unknown Service'
        })),
      };

      return NextResponse.json(formattedEvent);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If there's a database error, fall back to mock data
      return NextResponse.json(getMockEvent(id));
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
} 