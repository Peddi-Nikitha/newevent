const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to add test users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        fullName: 'Admin User',
        email: 'admin@example.com',
        phone: '+1234567890',
        passwordHash: adminPassword,
        role: 'ADMIN'
      }
    });
    
    console.log(`Created admin user: ${admin.email}`);
    
    // Create customer users
    const customers = [
      { fullName: 'John Customer', email: 'customer1@example.com', phone: '+1987654321' },
      { fullName: 'Jane Smith', email: 'customer2@example.com', phone: '+1555123456' },
      { fullName: 'Robert Johnson', email: 'customer3@example.com', phone: '+1555789012' },
      { fullName: 'Sarah Williams', email: 'customer4@example.com', phone: '+1555222333' },
      { fullName: 'Michael Brown', email: 'customer5@example.com', phone: '+1555444555' },
    ];
    
    const customerPassword = await bcrypt.hash('customer123', 10);
    
    for (const customer of customers) {
      const user = await prisma.user.create({
        data: {
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          passwordHash: customerPassword,
          role: 'CUSTOMER'
        }
      });
      
      console.log(`Created customer user: ${user.email}`);
    }
    
    // Create vendor users
    const vendors = [
      { 
        user: { fullName: 'Mike Photographer', email: 'photographer@example.com', phone: '+1567891234' },
        vendor: { 
          businessName: 'Perfect Shots Photography', 
          category: 'PHOTOGRAPHY',
          location: 'New York, NY',
          minPrice: 500,
          maxPrice: 3000,
          rating: 4.8,
          description: 'Professional photography services for all types of events.',
          profileImg: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e'
        }
      },
      { 
        user: { fullName: 'Lisa Caterer', email: 'catering@example.com', phone: '+1456789123' },
        vendor: { 
          businessName: 'Delicious Bites Catering', 
          category: 'CATERING',
          location: 'Los Angeles, CA',
          minPrice: 1000,
          maxPrice: 10000,
          rating: 4.6,
          description: 'We provide delicious food for all types of events.',
          profileImg: 'https://images.unsplash.com/photo-1555244162-803834f70033'
        }
      },
      { 
        user: { fullName: 'James DJ', email: 'dj@example.com', phone: '+1789456123' },
        vendor: { 
          businessName: 'Elite Sound Entertainment', 
          category: 'MUSIC',
          location: 'Miami, FL',
          minPrice: 800,
          maxPrice: 2500,
          rating: 4.5,
          description: 'Professional DJ services for all types of events.',
          profileImg: 'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2'
        }
      }
    ];
    
    const vendorPassword = await bcrypt.hash('vendor123', 10);
    
    for (const vendorData of vendors) {
      // Create vendor user
      const user = await prisma.user.create({
        data: {
          fullName: vendorData.user.fullName,
          email: vendorData.user.email,
          phone: vendorData.user.phone,
          passwordHash: vendorPassword,
          role: 'VENDOR'
        }
      });
      
      // Create vendor profile
      const vendor = await prisma.vendor.create({
        data: {
          userId: user.id,
          ...vendorData.vendor
        }
      });
      
      console.log(`Created vendor: ${vendor.businessName}`);
      
      // Create some services for each vendor
      const services = [
        {
          title: 'Basic Package',
          description: 'Our entry-level service package',
          price: Math.floor(Math.random() * 500) + 500
        },
        {
          title: 'Premium Package',
          description: 'Our most popular service package with additional features',
          price: Math.floor(Math.random() * 1000) + 1000
        },
        {
          title: 'Deluxe Package',
          description: 'Our top-tier comprehensive service package',
          price: Math.floor(Math.random() * 1500) + 1500
        }
      ];
      
      for (const serviceData of services) {
        const service = await prisma.service.create({
          data: {
            vendorId: vendor.id,
            ...serviceData
          }
        });
        
        console.log(`  - Added service: ${service.title} ($${service.price})`);
      }
    }
    
    console.log('Test users added successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 