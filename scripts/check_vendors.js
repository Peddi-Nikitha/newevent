const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking vendors data...');

    // Check the Vendor table columns
    const vendorColumns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Vendor'
    `);
    
    console.log('Vendor table columns:');
    vendorColumns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

    // Count vendors
    const vendorCount = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) FROM "Vendor"
    `);
    
    console.log('\nTotal vendors:', vendorCount[0].count);

    // Check vendor sample data
    const sampleVendors = await prisma.$queryRawUnsafe(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Vendor'
      ORDER BY column_name
    `);
    
    console.log('\nAll Vendor columns in alphabetical order:');
    sampleVendors.forEach(col => {
      console.log(`- ${col.column_name}`);
    });

  } catch (error) {
    console.error('Error checking vendors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 