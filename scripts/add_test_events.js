const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to add test events...');

    // First, check what tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tables = await prisma.$queryRawUnsafe(tablesQuery);
    console.log('Available tables:', tables.map(t => t.table_name));

    // Get a customer user ID to associate with events
    const usersTable = tables.find(t => t.table_name.toLowerCase() === 'user' || t.table_name.toLowerCase() === 'users');
    if (!usersTable) {
      console.error('No users table found!');
      return;
    }

    const userQuery = `
      SELECT id FROM "${usersTable.table_name}" 
      WHERE role = 'CUSTOMER' 
      LIMIT 1
    `;
    
    const userResult = await prisma.$queryRawUnsafe(userQuery);
    if (userResult.length === 0) {
      console.error('No customer users found!');
      return;
    }
    
    const userId = userResult[0].id;
    console.log(`Using user ID: ${userId}`);

    // Determine the events table name
    const eventsTable = tables.find(t => t.table_name.toLowerCase() === 'event' || t.table_name.toLowerCase() === 'events');
    if (!eventsTable) {
      console.error('No events table found!');
      return;
    }

    // Check column names in the events table
    const columnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = '${eventsTable.table_name.toLowerCase()}'
    `;
    
    const columns = await prisma.$queryRawUnsafe(columnsQuery);
    console.log(`Columns in ${eventsTable.table_name}:`, columns.map(c => c.column_name));

    // Determine column names
    const userIdCol = columns.find(c => c.column_name.toLowerCase() === 'userid' || c.column_name.toLowerCase() === 'user_id');
    const eventTypeCol = columns.find(c => c.column_name.toLowerCase() === 'eventtype' || c.column_name.toLowerCase() === 'event_type');
    
    if (!userIdCol || !eventTypeCol) {
      console.error('Required columns not found in events table!');
      return;
    }

    // Event types and locations
    const eventTypes = ['WEDDING', 'BIRTHDAY', 'CORPORATE', 'BABY_SHOWER', 'ANNIVERSARY', 'GRADUATION', 'HOLIDAY', 'OTHER'];
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];

    // Add 15 test events
    for (let i = 0; i < 15; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const budget = Math.floor(Math.random() * 20000) + 5000;
      const date = new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      
      // Create the insert query based on the table and column names
      const insertQuery = `
        INSERT INTO "${eventsTable.table_name}" (
          "${userIdCol.column_name}", 
          "${eventTypeCol.column_name}", 
          location, 
          date, 
          budget, 
          "createdAt", 
          "updatedAt"
        )
        VALUES (
          '${userId}', 
          '${eventType}', 
          '${location}', 
          '${date.toISOString()}', 
          ${budget}, 
          NOW(), 
          NOW()
        )
        RETURNING id
      `;
      
      try {
        const result = await prisma.$queryRawUnsafe(insertQuery);
        console.log(`Created event ${i+1}/15: ${eventType} in ${location} with ID ${result[0].id}`);
      } catch (error) {
        console.error(`Error creating event ${i+1}:`, error);
      }
    }

    console.log('Test events added successfully!');
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