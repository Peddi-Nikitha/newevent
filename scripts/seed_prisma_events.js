const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Event type options
const eventTypes = [
  'WEDDING',
  'BIRTHDAY',
  'CORPORATE',
  'BABY_SHOWER',
  'ANNIVERSARY',
  'GRADUATION',
  'HOLIDAY',
  'OTHER'
];

// Locations
const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA'
];

// Function to generate random date between start and end
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  try {
    console.log('Starting to seed events with Prisma...');

    // First, get all users and vendors to associate with events
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      take: 10
    });

    const vendors = await prisma.vendor.findMany({
      include: {
        services: true
      }
    });

    if (users.length === 0) {
      console.error('No customer users found in the database. Please create some users first.');
      return;
    }

    if (vendors.length === 0) {
      console.error('No vendors found in the database. Please create some vendors first.');
      return;
    }

    console.log(`Found ${users.length} users and ${vendors.length} vendors`);

    // Create 30 events
    const createdEvents = [];
    for (let i = 0; i < 30; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const budget = Math.floor(Math.random() * 20000) + 5000; // Random budget between 5000-25000
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Date between now and 1 year in the future
      const date = randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
      
      console.log(`Creating event ${i+1}/30: ${eventType} in ${location}`);
      
      const event = await prisma.event.create({
        data: {
          userId: user.id,
          eventType,
          location,
          date,
          budget
        }
      });
      
      createdEvents.push(event);
      
      // Add 1-4 vendors to each event
      const numVendors = Math.floor(Math.random() * 4) + 1;
      const shuffledVendors = [...vendors].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < Math.min(numVendors, shuffledVendors.length); j++) {
        const vendor = shuffledVendors[j];
        
        if (vendor.services.length > 0) {
          const service = vendor.services[Math.floor(Math.random() * vendor.services.length)];
          const agreedPrice = service.price - Math.floor(Math.random() * 100); // Slight discount
          
          const statusOptions = ['PENDING', 'CONFIRMED', 'PAID'];
          const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
          
          await prisma.eventVendor.create({
            data: {
              eventId: event.id,
              vendorId: vendor.id,
              serviceId: service.id,
              agreedPrice,
              status
            }
          });
        }
      }
    }

    console.log(`Successfully created ${createdEvents.length} events with vendors!`);

  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 