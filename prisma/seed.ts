import { PrismaClient, UserRole, VendorCategory, EventType } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPasswordHash = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@happyhappenings.com' },
    update: {},
    create: {
      email: 'admin@happyhappenings.com',
      fullname: 'Admin User',
      passwordhash: adminPasswordHash,
      role: UserRole.ADMIN,
      phone: '+1234567890',
    },
  });
  
  console.log('Admin created:', admin.email);

  // Create customer users
  const customerPasswordHash = await hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      fullname: 'John Customer',
      passwordhash: customerPasswordHash,
      role: UserRole.CUSTOMER,
      phone: '+1987654321',
    },
  });

  console.log('Customer created:', customer.email);

  // Create vendor users and their profiles
  const vendorPasswordHash = await hash('vendor123', 10);
  
  // Photography vendor
  const photoVendor = await prisma.user.upsert({
    where: { email: 'photographer@example.com' },
    update: {},
    create: {
      email: 'photographer@example.com',
      fullname: 'Mike Photographer',
      passwordhash: vendorPasswordHash,
      role: UserRole.VENDOR,
      phone: '+1567891234',
      Vendor: {
        create: {
          businessname: 'Perfect Shots Photography',
          category: VendorCategory.PHOTOGRAPHY,
          location: 'New York, NY',
          minprice: 500,
          maxprice: 3000,
          rating: 4.8,
          description: 'Professional photography services for all types of events. We capture your special moments with artistic vision and technical excellence.',
          profileimg: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
        },
      },
    },
  });

  console.log('Photography vendor created:', photoVendor.email);

  // Catering vendor
  const cateringVendor = await prisma.user.upsert({
    where: { email: 'catering@example.com' },
    update: {},
    create: {
      email: 'catering@example.com',
      fullname: 'Lisa Caterer',
      passwordhash: vendorPasswordHash,
      role: UserRole.VENDOR,
      phone: '+1456789123',
      Vendor: {
        create: {
          businessname: 'Delicious Bites Catering',
          category: VendorCategory.CATERING,
          location: 'Los Angeles, CA',
          minprice: 1000,
          maxprice: 10000,
          rating: 4.6,
          description: 'We provide delicious food for all types of events. From casual to gourmet, we have menu options to fit every taste and budget.',
          profileimg: 'https://images.unsplash.com/photo-1555244162-803834f70033',
        },
      },
    },
  });

  console.log('Catering vendor created:', cateringVendor.email);

  // Venue vendor
  const venueVendor = await prisma.user.upsert({
    where: { email: 'venue@example.com' },
    update: {},
    create: {
      email: 'venue@example.com',
      fullname: 'Robert Venue',
      passwordhash: vendorPasswordHash,
      role: UserRole.VENDOR,
      phone: '+1345678912',
      Vendor: {
        create: {
          businessname: 'Elegant Events Hall',
          category: VendorCategory.VENUE,
          location: 'Chicago, IL',
          minprice: 2000,
          maxprice: 15000,
          rating: 4.9,
          description: 'A beautiful venue for weddings, corporate events, and special celebrations. Our elegant space can accommodate both intimate gatherings and large parties.',
          profileimg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
        },
      },
    },
  });

  console.log('Venue vendor created:', venueVendor.email);

  // Create services for vendors
  // Photography services
  const photoVendorData = await prisma.vendor.findUnique({
    where: { userid: photoVendor.id },
  });

  if (photoVendorData) {
    const photoServices = [
      {
        title: 'Basic Wedding Package',
        description: '6 hours of coverage, 1 photographer, 200 edited digital photos, online gallery',
        price: 1200,
        vendorid: photoVendorData.id,
      },
      {
        title: 'Premium Wedding Package',
        description: '10 hours of coverage, 2 photographers, engagement session, 500 edited digital photos, online gallery, wedding album',
        price: 2500,
        vendorid: photoVendorData.id,
      },
      {
        title: 'Corporate Event Coverage',
        description: '4 hours of coverage, 1 photographer, 100 edited digital photos, online gallery',
        price: 800,
        vendorid: photoVendorData.id,
      },
    ];

    for (const service of photoServices) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log('Photography services created');
  }

  // Catering services
  const cateringVendorData = await prisma.vendor.findUnique({
    where: { userid: cateringVendor.id },
  });

  if (cateringVendorData) {
    const cateringServices = [
      {
        title: 'Buffet Style - Standard',
        description: 'Selection of appetizers, 2 main courses, 3 sides, dessert. $25 per person, 50 person minimum',
        price: 1250,
        vendorid: cateringVendorData.id,
      },
      {
        title: 'Plated Dinner - Premium',
        description: 'Elegant plated service with 3-course meal including appetizer, main course, and dessert. $45 per person, 30 person minimum',
        price: 1350,
        vendorid: cateringVendorData.id,
      },
      {
        title: 'Cocktail Reception',
        description: 'Passed hors d\'oeuvres, charcuterie display, and beverage service. $35 per person, 40 person minimum',
        price: 1400,
        vendorid: cateringVendorData.id,
      },
    ];

    for (const service of cateringServices) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log('Catering services created');
  }

  // Venue services
  const venueVendorData = await prisma.vendor.findUnique({
    where: { userid: venueVendor.id },
  });

  if (venueVendorData) {
    const venueServices = [
      {
        title: 'Grand Ballroom - Weekend',
        description: 'Our largest space accommodating up to 300 guests. Includes tables, chairs, basic linens, and setup/cleanup. Available Friday-Sunday.',
        price: 6000,
        vendorid: venueVendorData.id,
      },
      {
        title: 'Grand Ballroom - Weekday',
        description: 'Our largest space accommodating up to 300 guests. Includes tables, chairs, basic linens, and setup/cleanup. Available Monday-Thursday.',
        price: 4000,
        vendorid: venueVendorData.id,
      },
      {
        title: 'Garden Terrace',
        description: 'Beautiful outdoor space for ceremonies or receptions. Accommodates up to 150 guests. Includes garden chairs and setup/cleanup.',
        price: 3500,
        vendorid: venueVendorData.id,
      },
    ];

    for (const service of venueServices) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log('Venue services created');
  }

  // Create a sample event
  const event = await prisma.event.create({
    data: {
      userid: customer.id,
      eventtype: EventType.WEDDING,
      location: 'New York, NY',
      date: new Date('2023-12-15'),
      budget: 15000,
    },
  });

  console.log('Sample event created:', event.id);

  // Create sample bookings
  if (photoVendorData && venueVendorData) {
    // Find a service for each vendor
    const photoService = await prisma.service.findFirst({
      where: { vendorid: photoVendorData.id },
    });
    
    const venueService = await prisma.service.findFirst({
      where: { vendorid: venueVendorData.id },
    });

    if (photoService && venueService) {
      // Create booking for photography service
      await prisma.eventVendor.create({
        data: {
          eventid: event.id,
          vendorid: photoVendorData.id,
          serviceid: photoService.id,
          agreedprice: photoService.price,
          status: 'CONFIRMED',
        },
      });

      // Create booking for venue service
      await prisma.eventVendor.create({
        data: {
          eventid: event.id,
          vendorid: venueVendorData.id,
          serviceid: venueService.id,
          agreedprice: venueService.price,
          status: 'CONFIRMED',
        },
      });

      console.log('Sample bookings created');
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 