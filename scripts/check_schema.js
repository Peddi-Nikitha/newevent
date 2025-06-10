const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database schema...');

    // Check the Event table columns
    const eventColumns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Event'
    `);
    
    console.log('Event table columns:');
    eventColumns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

    // Check a sample event to see actual data
    const sampleEvent = await prisma.$queryRawUnsafe(`
      SELECT * FROM "Event" LIMIT 1
    `);
    
    if (sampleEvent && sampleEvent.length > 0) {
      console.log('\nSample event data:');
      console.log(JSON.stringify(sampleEvent[0], null, 2));
    } else {
      console.log('\nNo events found in the database.');
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 