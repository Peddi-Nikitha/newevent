const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@happyhappenings.com' },
    update: {},
    create: {
      email: 'admin@happyhappenings.com',
      fullname: 'Admin User',
      passwordhash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });
  
  console.log('Admin created:', admin.email);

  // Create customer users
  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      fullname: 'John Customer',
      passwordhash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: '+1987654321',
    },
  });

  console.log('Customer created:', customer.email);

  // Create vendor users and their profiles
  const vendorPasswordHash = await bcrypt.hash('vendor123', 10);
  
  // Photography vendor
  const photoVendor = await prisma.user.upsert({
    where: { email: 'photographer@example.com' },
    update: {},
    create: {
      email: 'photographer@example.com',
      fullname: 'Mike Photographer',
      passwordhash: vendorPasswordHash,
      role: 'VENDOR',
      phone: '+1567891234',
      Vendor: {
        create: {
          businessname: 'Perfect Shots Photography',
          category: 'PHOTOGRAPHY',
          location: 'London, UK',
          minprice: 100,
          maxprice: 900,
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
      role: 'VENDOR',
      phone: '+1456789123',
      Vendor: {
        create: {
          businessname: 'Delicious Bites Catering',
          category: 'CATERING',
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
      role: 'VENDOR',
      phone: '+1345678912',
      Vendor: {
        create: {
          businessname: 'Elegant Events Hall',
          category: 'VENUE',
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

  // Music vendor
  const musicVendor = await prisma.user.upsert({
    where: { email: 'music@example.com' },
    update: {},
    create: {
      email: 'music@example.com',
      fullname: 'DJ Beats',
      passwordhash: vendorPasswordHash,
      role: 'VENDOR',
      phone: '+17778889999',
      Vendor: {
        create: {
          businessname: 'Rhythm Makers',
          category: 'MUSIC',
          location: 'New York, NY',
          minprice: 500,
          maxprice: 5000,
          rating: 4.7,
          description: 'Professional DJ and live music services for all events.',
          profileimg: 'https://images.unsplash.com/photo-1514525253161-591b9201f9c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        },
      },
    },
  });
  console.log('Music vendor created:', musicVendor.email);

  // Decoration vendor
  const decorVendor = await prisma.user.upsert({
    where: { email: 'decor@example.com' },
    update: {},
    create: {
      email: 'decor@example.com',
      fullname: 'Decor Dreams',
      passwordhash: vendorPasswordHash,
      role: 'VENDOR',
      phone: '+16665554444',
      Vendor: {
        create: {
          businessname: 'Event Elegance Decor',
          category: 'DECORATION',
          location: 'Los Angeles, CA',
          minprice: 300,
          maxprice: 3000,
          rating: 4.9,
          description: 'Transforming spaces into breathtaking experiences with our exquisite decor.',
          profileimg: 'https://images.unsplash.com/photo-1506197607739-e93245c36531?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        },
      },
    },
  });
  console.log('Decoration vendor created:', decorVendor.email);

  // Flowers vendor
  const flowerVendor = await prisma.user.upsert({
    where: { email: 'flowers@example.com' },
    update: {},
    create: {
      email: 'flowers@example.com',
      fullname: 'Floral Fantasy',
      passwordhash: vendorPasswordHash,
      role: 'VENDOR',
      phone: '+19998887777',
      Vendor: {
        create: {
          businessname: 'Bloom & Petal',
          category: 'FLOWERS',
          location: 'Chicago, IL',
          minprice: 200,
          maxprice: 2000,
          rating: 4.8,
          description: 'Fresh and beautiful floral arrangements for any occasion.',
          profileimg: 'https://images.unsplash.com/photo-1534062489679-b1d1f045c2f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        },
      },
    },
  });
  console.log('Flowers vendor created:', flowerVendor.email);

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

  // Music services
  const musicVendorData = await prisma.vendor.findUnique({
    where: { userid: musicVendor.id },
  });

  if (musicVendorData) {
    const musicServices = [
      {
        title: 'Basic DJ Package',
        description: '4 hours of DJ service, basic sound system',
        price: 800,
        vendorid: musicVendorData.id,
      },
      {
        title: 'Premium Band Package',
        description: '3 hours of live band performance, full sound and lighting',
        price: 3000,
        vendorid: musicVendorData.id,
      },
    ];
    for (const service of musicServices) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log('Music services created');
  }

  // Decoration services
  const decorVendorData = await prisma.vendor.findUnique({
    where: { userid: decorVendor.id },
  });

  if (decorVendorData) {
    const decorServices = [
      {
        title: 'Standard Decor Package',
        description: 'Table centerpieces, basic drapes, chair covers',
        price: 700,
        vendorid: decorVendorData.id,
      },
      {
        title: 'Luxury Decor Package',
        description: 'Premium floral arrangements, themed decor, elaborate lighting',
        price: 2500,
        vendorid: decorVendorData.id,
      },
    ];
    for (const service of decorServices) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log('Decoration services created');
  }

  // Flowers services
  const flowerVendorData = await prisma.vendor.findUnique({
    where: { userid: flowerVendor.id },
  });

  if (flowerVendorData) {
    const flowerServices = [
      {
        title: 'Bridal Bouquet & Boutonnieres',
        description: 'Custom bridal bouquet and 5 boutonnieres',
        price: 400,
        vendorid: flowerVendorData.id,
      },
      {
        title: 'Full Floral Event Decor',
        description: 'Table centerpieces, arch decor, aisle arrangements',
        price: 1800,
        vendorid: flowerVendorData.id,
      },
    ];
    for (const service of flowerServices) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log('Flowers services created');
  }

  // Create a sample event
  const event = await prisma.event.create({
    data: {
      userid: customer.id,
      eventtype: 'WEDDING',
      location: 'New York, NY',
      date: new Date('2023-12-15'),
      budget: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1517487881027-e85d87a71f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
  });

  console.log('Sample event created:', event.id);

  // Create 10 more sample events with images
  const sampleEvents = [
    {
      userid: customer.id,
      eventtype: 'BIRTHDAY',
      location: 'Miami, FL',
      date: new Date('2024-03-20'),
      budget: 5000,
      imageUrl: 'https://images.unsplash.com/photo-1549420076-7880b9d9c2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'CORPORATE',
      location: 'San Francisco, CA',
      date: new Date('2024-04-10'),
      budget: 20000,
      imageUrl: 'https://images.unsplash.com/photo-1531051515082-fdb6b3d11b23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'BABY_SHOWER',
      location: 'Austin, TX',
      date: new Date('2024-05-01'),
      budget: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1557007787-7880b9d9c2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'ANNIVERSARY',
      location: 'Seattle, WA',
      date: new Date('2024-06-15'),
      budget: 7000,
      imageUrl: 'https://images.unsplash.com/photo-1511210874677-7043a53f06c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'GRADUATION',
      location: 'Boston, MA',
      date: new Date('2024-07-20'),
      budget: 4000,
      imageUrl: 'https://images.unsplash.com/photo-1523050854805-d913676aa11e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'HOLIDAY',
      location: 'Denver, CO',
      date: new Date('2024-12-05'),
      budget: 6000,
      imageUrl: 'https://images.unsplash.com/photo-1513684807490-62e92c2a0d1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'CONFERENCE',
      location: 'Las Vegas, NV',
      date: new Date('2024-09-01'),
      budget: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1560940316-c954e3f42159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'GALA',
      location: 'New Orleans, LA',
      date: new Date('2024-11-20'),
      budget: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1549488349-2ad6e1075d9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'MUSIC_CONCERT',
      location: 'Nashville, TN',
      date: new Date('2024-10-05'),
      budget: 8000,
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-b7854f4340d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      userid: customer.id,
      eventtype: 'SPORTING_EVENT',
      location: 'Dallas, TX',
      date: new Date('2024-08-25'),
      budget: 10000,
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
  ];

  // Create sample bookings
  const allServices = await prisma.service.findMany();

  for (const newEvent of sampleEvents) {
    const createdEvent = await prisma.event.create({
      data: newEvent,
    });
    console.log(`Event created: ${newEvent.eventtype} at ${newEvent.location}`);

    // Randomly assign 2-4 services to each event from different categories
    const shuffledServices = allServices.sort(() => 0.5 - Math.random());
    const servicesToAssign = shuffledServices.slice(0, Math.floor(Math.random() * 3) + 2); // 2 to 4 services

    for (const service of servicesToAssign) {
      const vendor = await prisma.vendor.findUnique({ where: { id: service.vendorid } });
      if (vendor) {
        await prisma.eventVendor.create({
          data: {
            agreedprice: service.price,
            status: 'CONFIRMED',
            Event: { connect: { id: createdEvent.id } },
            Service: { connect: { id: service.id } },
            Vendor: { connect: { id: vendor.id } },
          },
        });
        console.log(`  -> Connected ${vendor.businessname} (${service.title}) to event ${createdEvent.id}`);
      }
    }
  }

  // Old sample bookings (can be removed or modified if needed)
  // This section is now redundant as new events are created with random vendors.
  // Leaving it commented out for now, can be removed later if confident.
  // if (photoVendorData && venueVendorData) {
  //   // Find a service for each vendor
  //   const photoService = await prisma.service.findFirst({
  //     where: { vendorid: photoVendorData.id },
  //   });
  //   const venueService = await prisma.service.findFirst({
  //     where: { vendorid: venueVendorData.id },
  //   });
  //   if (photoService && venueService) {
  //     const photoBooking = await prisma.eventVendor.create({
  //       data: {
  //         agreedprice: photoService.price,
  //         status: 'CONFIRMED',
  //         Event: { connect: { id: event.id } },
  //         Service: { connect: { id: photoService.id } },
  //         Vendor: { connect: { id: photoVendorData.id } },
  //       }
  //     });
  //     console.log('Photography booking created');
  //     const venueBooking = await prisma.eventVendor.create({
  //       data: {
  //         eventid: event.id,
  //         agreedprice: venueService.price,
  //         status: 'CONFIRMED',
  //         Event: { connect: { id: event.id } },
  //         Service: { connect: { id: venueService.id } },
  //         Vendor: { connect: { id: venueVendorData.id } }
  //       }
  //     });
  //     console.log('Venue booking created');
  //   }
  // }

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