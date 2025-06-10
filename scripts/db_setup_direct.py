import os
import psycopg2
import bcrypt
import random
import json
from datetime import datetime, timedelta, date as date_type

# HARDCODED CONNECTION STRING - USE YOUR ACTUAL NEON DB OR OTHER CLOUD DATABASE URL
# Example Neon DB format: "postgresql://username:password@ep-cool-name-12345.us-east-2.aws.neon.tech/database?sslmode=require"
DB_URL = "postgresql://neondb_owner:npg_tPq4Rkf1Lsgd@ep-polished-forest-abs4zlmc-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# Sample data
vendor_categories = [
    'PHOTOGRAPHY', 'CATERING', 'MUSIC', 'VENUE', 'DECORATION', 
    'CAKE', 'FLOWERS', 'DRESS', 'MAKEUP', 'TRANSPORTATION', 'OTHER'
]

event_types = [
    'WEDDING', 'BIRTHDAY', 'CORPORATE', 'BABY_SHOWER', 
    'ANNIVERSARY', 'GRADUATION', 'HOLIDAY', 'OTHER'
]

booking_statuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED']

locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
    'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
]

# Add more profile image URLs for vendors
vendor_profile_images = [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',  # Photography 
    'https://images.unsplash.com/photo-1555244162-803834f70033',  # Catering
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',  # Venue
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364',  # Flowers
    'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2',  # DJ/Music
    'https://images.unsplash.com/photo-1622467827417-bbe2237067a9',  # Cakes
    'https://images.unsplash.com/photo-1529636798458-92182e662485',  # Decorations
    'https://images.unsplash.com/photo-1550005809-91ad75fb315f',  # Wedding Dress
    'https://images.unsplash.com/photo-1470259078422-826894b933aa',  # Makeup
    'https://images.unsplash.com/photo-1586803104882-abe1757369ce',  # Transportation
    'https://images.unsplash.com/photo-1557555187-23d685287bc3',  # Other
]

# Add event-specific images
event_type_images = {
    'WEDDING': [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6',
        'https://images.unsplash.com/photo-1519741347686-c1e331ec5a10',
        'https://images.unsplash.com/photo-1550005809-91ad75fb315f',
    ],
    'BIRTHDAY': [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        'https://images.unsplash.com/photo-1464349153735-7db50ed83c84',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176',
        'https://images.unsplash.com/photo-1559456751-057ed33d93d4',
    ],
    'CORPORATE': [
        'https://images.unsplash.com/photo-1540317580384-e5d43867caa6',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
    ],
    'BABY_SHOWER': [
        'https://images.unsplash.com/photo-1544006659-f0b21884ce1d',
        'https://images.unsplash.com/photo-1615657944000-7dcbc7decb0f',
        'https://images.unsplash.com/photo-1580397581145-cdb6a35b7d3f',
        'https://images.unsplash.com/photo-1532038889905-1b4543ee64f3',
    ],
    'ANNIVERSARY': [
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a',
        'https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4',
        'https://images.unsplash.com/photo-1523438885200-e635ba2c371e',
        'https://images.unsplash.com/photo-1522673607200-c771acbb4d7e',
    ],
    'GRADUATION': [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb',
        'https://images.unsplash.com/photo-1523289961518-a6a2a3d13be2',
        'https://images.unsplash.com/photo-1564750687467-f4348c64c379',
    ],
    'HOLIDAY': [
        'https://images.unsplash.com/photo-1512909006721-3d6018887383',
        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a',
        'https://images.unsplash.com/photo-1543934638-bd2e138a3a68',
        'https://images.unsplash.com/photo-1482517967863-00e15c9b44be',
    ],
    'OTHER': [
        'https://images.unsplash.com/photo-1511578314322-379afb476865',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        'https://images.unsplash.com/photo-1496337589254-7e19d01cec44',
        'https://images.unsplash.com/photo-1470753937643-efeb931202a9',
    ],
}

# More descriptive review texts
review_texts = [
    "Great service! Highly recommended. The team was professional from start to finish.",
    "Excellent vendor, very professional. They exceeded our expectations in every way.",
    "They made our special day perfect! Every detail was handled with care.",
    "Exceeded our expectations in every way. Would definitely use again for future events.",
    "Very responsive and easy to work with. Great communication throughout the process.",
    "Good service, but a bit pricey. Quality was there, but consider more budget-friendly options.",
    "Amazing! Will definitely use again for future events. Everyone at our event commented on how great they were.",
    "Perfect execution of our vision. They understood exactly what we wanted.",
    "Reliable and punctual. No stress working with this vendor.",
    "Creative ideas and excellent execution. They brought something unique to our event.",
    "Friendly staff and great customer service. They made planning so much easier.",
    "High quality at a reasonable price. Great value for what you get.",
    "Flexible with last-minute changes. Really appreciated their adaptability.",
    "Beautifully done! Our guests were impressed with their work.",
    "Professional, organized, and detail-oriented. Everything was perfect!",
]

def create_tables(conn):
    """Create database tables"""
    cursor = conn.cursor()
    
    # Drop existing tables if they exist (in reverse order to avoid foreign key constraints)
    cursor.execute("""
    DROP TABLE IF EXISTS "Review" CASCADE;
    DROP TABLE IF EXISTS "EventVendor" CASCADE;
    DROP TABLE IF EXISTS "Event" CASCADE;
    DROP TABLE IF EXISTS "Service" CASCADE;
    DROP TABLE IF EXISTS "Vendor" CASCADE;
    DROP TABLE IF EXISTS "User" CASCADE;
    """)

    # Create users table
    cursor.execute("""
    CREATE TABLE "User" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(255),
        passwordHash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN')),
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    # Create vendors table
    cursor.execute("""
    CREATE TABLE "Vendor" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        userId UUID UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        businessName VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('PHOTOGRAPHY', 'CATERING', 'MUSIC', 'VENUE', 'DECORATION', 'CAKE', 'FLOWERS', 'DRESS', 'MAKEUP', 'TRANSPORTATION', 'OTHER')),
        location VARCHAR(255) NOT NULL,
        minPrice INT NOT NULL,
        maxPrice INT NOT NULL,
        rating FLOAT DEFAULT 0,
        description TEXT NOT NULL,
        profileImg TEXT
    );
    """)

    # Create services table
    cursor.execute("""
    CREATE TABLE "Service" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendorId UUID NOT NULL REFERENCES "Vendor"(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INT NOT NULL,
        availability JSONB
    );
    """)

    # Create events table
    cursor.execute("""
    CREATE TABLE "Event" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        userId UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        eventType VARCHAR(50) NOT NULL CHECK (eventType IN ('WEDDING', 'BIRTHDAY', 'CORPORATE', 'BABY_SHOWER', 'ANNIVERSARY', 'GRADUATION', 'HOLIDAY', 'OTHER')),
        location VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        budget INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    # Create event_vendors table (bookings)
    cursor.execute("""
    CREATE TABLE "EventVendor" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        eventId UUID NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
        vendorId UUID NOT NULL REFERENCES "Vendor"(id) ON DELETE CASCADE,
        serviceId UUID NOT NULL REFERENCES "Service"(id) ON DELETE CASCADE,
        agreedPrice INT NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED')),
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    # Create reviews table
    cursor.execute("""
    CREATE TABLE "Review" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        userId UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        vendorId UUID NOT NULL REFERENCES "Vendor"(id) ON DELETE CASCADE,
        eventId UUID NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        reviewText TEXT,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    conn.commit()
    print("Tables created successfully")


def seed_data(conn):
    """Seed the database with sample data"""
    cursor = conn.cursor()
    
    # Helper function to hash passwords
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    print("  Creating admin user...")
    # Create admin user
    admin_password = hash_password('admin123')
    cursor.execute("""
    INSERT INTO "User" (fullName, email, phone, passwordHash, role)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id;
    """, ('Admin User', 'admin@happyhappenings.com', '+1234567890', admin_password, 'ADMIN'))
    
    print("  Creating customer users...")
    # Create customer users
    customers = [
        ('John Customer', 'customer1@example.com', '+1987654321', hash_password('customer123'), 'CUSTOMER'),
        ('Jane Smith', 'customer2@example.com', '+1555123456', hash_password('customer123'), 'CUSTOMER'),
        ('Robert Johnson', 'customer3@example.com', '+1555789012', hash_password('customer123'), 'CUSTOMER'),
        ('Sarah Williams', 'customer4@example.com', '+1555222333', hash_password('customer123'), 'CUSTOMER'),
        ('Michael Brown', 'customer5@example.com', '+1555444555', hash_password('customer123'), 'CUSTOMER'),
        ('Emily Davis', 'customer6@example.com', '+1555666777', hash_password('customer123'), 'CUSTOMER'),
        ('David Miller', 'customer7@example.com', '+1555888999', hash_password('customer123'), 'CUSTOMER'),
        ('Jennifer Wilson', 'customer8@example.com', '+1555111222', hash_password('customer123'), 'CUSTOMER'),
        ('James Taylor', 'customer9@example.com', '+1555333444', hash_password('customer123'), 'CUSTOMER'),
        ('Lisa Anderson', 'customer10@example.com', '+1555555666', hash_password('customer123'), 'CUSTOMER'),
    ]
    
    customer_ids = []
    for customer in customers:
        cursor.execute("""
        INSERT INTO "User" (fullName, email, phone, passwordHash, role)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """, customer)
        customer_ids.append(cursor.fetchone()[0])
    
    print("  Creating vendor users and profiles...")
    # Create vendor users and their profiles
    vendors_data = [
        {
            'user': ('Mike Photographer', 'photographer@example.com', '+1567891234', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Perfect Shots Photography', 'PHOTOGRAPHY', 'New York, NY', 500, 3000, 4.8, 
                        'Professional photography services for all types of events. We capture your special moments with artistic vision and technical excellence.',
                        vendor_profile_images[0]),
            'services': [
                ('Basic Wedding Package', '6 hours of coverage, 1 photographer, 200 edited digital photos, online gallery', 1200),
                ('Premium Wedding Package', '10 hours of coverage, 2 photographers, engagement session, 500 edited digital photos, online gallery, wedding album', 2500),
                ('Corporate Event Coverage', '4 hours of coverage, 1 photographer, 100 edited digital photos, online gallery', 800)
            ]
        },
        {
            'user': ('Lisa Caterer', 'catering@example.com', '+1456789123', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Delicious Bites Catering', 'CATERING', 'Los Angeles, CA', 1000, 10000, 4.6,
                       'We provide delicious food for all types of events. From casual to gourmet, we have menu options to fit every taste and budget.',
                       vendor_profile_images[1]),
            'services': [
                ('Buffet Style - Standard', 'Selection of appetizers, 2 main courses, 3 sides, dessert. $25 per person, 50 person minimum', 1250),
                ('Plated Dinner - Premium', 'Elegant plated service with 3-course meal including appetizer, main course, and dessert. $45 per person, 30 person minimum', 1350),
                ('Cocktail Reception', 'Passed hors d\'oeuvres, charcuterie display, and beverage service. $35 per person, 40 person minimum', 1400)
            ]
        },
        {
            'user': ('Robert Venue', 'venue@example.com', '+1345678912', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Elegant Events Hall', 'VENUE', 'Chicago, IL', 2000, 15000, 4.9,
                       'A beautiful venue for weddings, corporate events, and special celebrations. Our elegant space can accommodate both intimate gatherings and large parties.',
                       vendor_profile_images[2]),
            'services': [
                ('Grand Ballroom - Weekend', 'Our largest space accommodating up to 300 guests. Includes tables, chairs, basic linens, and setup/cleanup. Available Friday-Sunday.', 6000),
                ('Grand Ballroom - Weekday', 'Our largest space accommodating up to 300 guests. Includes tables, chairs, basic linens, and setup/cleanup. Available Monday-Thursday.', 4000),
                ('Garden Terrace', 'Beautiful outdoor space for ceremonies or receptions. Accommodates up to 150 guests. Includes garden chairs and setup/cleanup.', 3500)
            ]
        },
        {
            'user': ('Maria Florist', 'florist@example.com', '+1234561234', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Blooming Creations', 'FLOWERS', 'San Francisco, CA', 300, 5000, 4.7,
                       'Beautiful floral arrangements for any occasion. We specialize in weddings, events, and custom arrangements that will make your special day unforgettable.',
                       vendor_profile_images[3]),
            'services': [
                ('Bridal Package', 'Bridal bouquet, 4 bridesmaid bouquets, 8 boutonnières, 2 corsages', 1200),
                ('Ceremony Decor', 'Altar/chuppah arrangement, 6 aisle arrangements, petals for flower girl', 850),
                ('Reception Centerpieces', '10 table centerpieces, head table garland, cake flowers', 1500)
            ]
        },
        {
            'user': ('James DJ', 'dj@example.com', '+1789456123', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Elite Sound Entertainment', 'MUSIC', 'Miami, FL', 800, 2500, 4.5,
                       'Professional DJ services for all types of events. We bring the perfect music, lighting, and energy to make your event memorable.',
                       vendor_profile_images[4]),
            'services': [
                ('Basic DJ Package', '4 hours of music, professional DJ, basic lighting, sound system', 800),
                ('Premium DJ Package', '6 hours of music, professional DJ, advanced lighting, sound system, MC services', 1500),
                ('Ultimate Party Package', '8 hours of music, professional DJ, premium lighting, sound system, MC services, photo booth', 2500)
            ]
        },
        {
            'user': ('Emma Cake', 'cake@example.com', '+1321654987', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Sweet Creations Bakery', 'CAKE', 'Boston, MA', 200, 2000, 4.8,
                       'Delicious and beautiful custom cakes for all occasions. Our team creates stunning designs that taste as good as they look.',
                       vendor_profile_images[5]),
            'services': [
                ('Wedding Cake - Basic', 'Three-tier cake serving up to 100 guests. Includes consultation, delivery, and setup.', 500),
                ('Wedding Cake - Premium', 'Four-tier cake with custom design serving up to 150 guests. Includes consultation, delivery, and setup.', 800),
                ('Cupcake Tower', '100 cupcakes in up to 3 flavors with small cutting cake on top. Includes display stand rental.', 400)
            ]
        },
        {
            'user': ('Alex Decorator', 'decor@example.com', '+1456987123', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Elegant Designs', 'DECORATION', 'Seattle, WA', 500, 8000, 4.6,
                       'Full-service event decoration company. We transform your venue into a magical space that matches your vision and style.',
                       vendor_profile_images[6]),
            'services': [
                ('Basic Decoration Package', 'Entrance decor, head table backdrop, table centerpieces for up to 10 tables.', 1200),
                ('Premium Decoration Package', 'Complete venue transformation including ceiling treatments, lighting, table decor, and custom backdrops.', 3500),
                ('Ceremony Decoration', 'Arch/altar decoration, aisle decor, entrance arrangements.', 800)
            ]
        },
        {
            'user': ('Sophia Fashion', 'dress@example.com', '+1789123456', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Bridal Elegance', 'DRESS', 'Dallas, TX', 500, 5000, 4.7,
                       'Exquisite wedding dresses and formal attire for your special day. We offer personalized styling services and custom alterations.',
                       vendor_profile_images[7]),
            'services': [
                ('Bridal Gown - Designer Collection', 'Selection from our curated designer collection. Includes basic alterations.', 2500),
                ('Bridal Gown - Custom Design', 'Fully custom designed and handcrafted bridal gown. Includes multiple fittings and alterations.', 4500),
                ('Bridesmaid Dresses Package', 'Coordinated bridesmaid dresses for groups of 4+. Includes basic alterations.', 1200)
            ]
        },
        {
            'user': ('Olivia Beauty', 'makeup@example.com', '+1123789456', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Glamour Beauty Team', 'MAKEUP', 'Atlanta, GA', 200, 1500, 4.8,
                       'Professional makeup and hair styling for weddings and special events. Our team creates flawless looks that last all day.',
                       vendor_profile_images[8]),
            'services': [
                ('Bridal Makeup & Hair', 'Complete bridal beauty package including trial, day-of makeup application, and hair styling.', 500),
                ('Bridal Party Package', 'Makeup and hair for bride plus 4 bridesmaids/family members.', 1200),
                ('Special Event Makeup', 'Professional makeup application for special events. Includes false lashes and touch-up kit.', 150)
            ]
        },
        {
            'user': ('William Transport', 'transport@example.com', '+1654789123', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Luxury Rides', 'TRANSPORTATION', 'Las Vegas, NV', 300, 3000, 4.5,
                       'Elegant transportation solutions for weddings and special events. Our fleet includes luxury cars, limousines, and party buses.',
                       vendor_profile_images[9]),
            'services': [
                ('Classic Car Package', '4 hours with chauffeur in a vintage classic car. Perfect for bride and groom transportation.', 800),
                ('Stretch Limousine', '6 hours with professional chauffeur. Accommodates up to 10 passengers.', 1200),
                ('Wedding Party Bus', '8 hours with professional chauffeur. Accommodates up to 20 passengers. Includes refreshments.', 2000)
            ]
        }
    ]
    
    vendor_data_map = {}  # To store vendor IDs and their services for later use
    
    for vendor in vendors_data:
        # Create vendor user
        cursor.execute("""
        INSERT INTO "User" (fullName, email, phone, passwordHash, role)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """, vendor['user'])
        
        user_id = cursor.fetchone()[0]
        
        # Create vendor profile
        cursor.execute("""
        INSERT INTO "Vendor" (userId, businessName, category, location, minPrice, maxPrice, rating, description, profileImg)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """, (user_id, *vendor['profile']))
        
        vendor_id = cursor.fetchone()[0]
        vendor_data_map[vendor_id] = {'services': []}
        
        # Create vendor services
        for service in vendor['services']:
            cursor.execute("""
            INSERT INTO "Service" (vendorId, title, description, price)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
            """, (vendor_id, *service))
            
            service_id = cursor.fetchone()[0]
            vendor_data_map[vendor_id]['services'].append({
                'id': service_id,
                'price': service[2]
            })
    
    print("  Creating initial events...")
    # Create initial events for each customer
    events = []
    for i, customer_id in enumerate(customer_ids):
        # Create 2-3 events per customer
        for _ in range(random.randint(2, 3)):
            event_date = datetime.now() + timedelta(days=random.randint(30, 365))
            event_type = random.choice(event_types)
            location = random.choice(locations)
            budget = random.randint(5000, 30000)
            
            cursor.execute("""
            INSERT INTO "Event" (userId, eventType, location, date, budget)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
            """, (customer_id, event_type, location, event_date.strftime('%Y-%m-%d'), budget))
            
            event_id = cursor.fetchone()[0]
            events.append({
                'id': event_id,
                'userId': customer_id,
                'eventType': event_type
            })
    
    print("  Creating additional customers...")
    # Create more customer users if needed
    additional_customers_needed = 30
    for i in range(additional_customers_needed):
        fullname = f"Customer {len(customer_ids) + i + 1}"
        email = f"customer{len(customer_ids) + i + 1}@example.com"
        phone = f"+1555{random.randint(100000, 999999)}"
        
        cursor.execute("""
        INSERT INTO "User" (fullName, email, phone, passwordHash, role)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """, (fullname, email, phone, hash_password('customer123'), 'CUSTOMER'))
        
        customer_ids.append(cursor.fetchone()[0])
    
    print("  Ensuring minimum events per type...")
    # Ensure we have at least 20 events per event type
    event_type_count = {event_type: 0 for event_type in event_types}
    
    # Count existing events by type
    for event in events:
        if isinstance(event, dict) and 'eventType' in event:
            event_type_count[event['eventType']] += 1
    
    # Generate additional events for each type to reach the minimum count of 20
    for event_type in event_types:
        needed_events = max(0, 20 - event_type_count[event_type])
        
        for i in range(needed_events):
            # Randomly select a user
            user_id = random.choice(customer_ids)
            
            # Generate event data based on type
            event_date = datetime.now() + timedelta(days=random.randint(-30, 365))
            location = random.choice(locations)
            
            # Set appropriate budget ranges based on event type
            if event_type == 'WEDDING':
                budget = random.randint(15000, 50000)
            elif event_type == 'CORPORATE':
                budget = random.randint(10000, 40000)
            elif event_type == 'BIRTHDAY':
                budget = random.randint(2000, 8000)
            elif event_type == 'BABY_SHOWER':
                budget = random.randint(1500, 5000)
            elif event_type == 'GRADUATION':
                budget = random.randint(3000, 10000)
            elif event_type == 'ANNIVERSARY':
                budget = random.randint(5000, 20000)
            else:
                budget = random.randint(2000, 15000)
            
            cursor.execute("""
            INSERT INTO "Event" (userId, eventType, location, date, budget)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
            """, (user_id, event_type, location, event_date.strftime('%Y-%m-%d'), budget))
            
            event_id = cursor.fetchone()[0]
            
            # Create event name based on type (not stored in DB but useful for context)
            event_name = ""
            if event_type == "WEDDING":
                names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Garcia", "Martinez"]
                event_name = f"The {random.choice(names)}-{random.choice(names)} Wedding"
            elif event_type == "BIRTHDAY":
                ages = [1, 5, 10, 16, 18, 21, 30, 40, 50, 60, 70]
                names = ["Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "James", "Isabella", "Oliver"]
                event_name = f"{random.choice(names)}'s {random.choice(ages)}th Birthday"
            elif event_type == "CORPORATE":
                companies = ["Tech Solutions", "Global Innovations", "Peak Performance", "Future Forward", "Summit Industries"]
                events = ["Annual Conference", "Team Building", "Product Launch", "Holiday Party", "Retreat"]
                event_name = f"{random.choice(companies)} {random.choice(events)}"
            elif event_type == "BABY_SHOWER":
                names = ["Emily", "Jacob", "Madison", "Michael", "Avery", "Matthew", "Sofia", "Daniel"]
                event_name = f"{random.choice(['Baby Boy', 'Baby Girl', 'Twins'])} Shower for {random.choice(names)}"
            elif event_type == "ANNIVERSARY":
                years = [5, 10, 25, 30, 40, 50]
                names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson"]
                event_name = f"{random.choice(names)} {random.choice(years)}th Anniversary"
            elif event_type == "GRADUATION":
                schools = ["Central High", "Washington University", "Greenfield College", "State University", "Tech Institute"]
                event_name = f"{random.choice(schools)} Graduation Celebration"
            elif event_type == "HOLIDAY":
                holidays = ["Christmas", "New Year's", "Thanksgiving", "Halloween", "Fourth of July"]
                event_name = f"{random.choice(holidays)} Party"
            else:
                event_name = f"{event_type.capitalize()} Event {i+1}"
            
            events.append({
                'id': event_id,
                'userId': user_id,
                'eventType': event_type,
                'name': event_name
            })
    
    print("  Creating bookings for events...")
    # Create bookings (event_vendors) for all events
    for event in events:
        # Choose 1-4 random vendors for each event
        num_vendors = random.randint(1, min(4, len(vendor_data_map)))
        
        # Try to match vendor categories with event types
        preferred_categories = []
        
        event_type = event['eventType'] if isinstance(event, dict) and 'eventType' in event else None
        
        if event_type == 'WEDDING':
            preferred_categories = ['VENUE', 'PHOTOGRAPHY', 'CATERING', 'FLOWERS', 'DRESS', 'MUSIC']
        elif event_type == 'CORPORATE':
            preferred_categories = ['VENUE', 'CATERING', 'MUSIC', 'PHOTOGRAPHY']
        elif event_type == 'BIRTHDAY':
            preferred_categories = ['VENUE', 'CATERING', 'CAKE', 'DECORATION', 'MUSIC']
        elif event_type == 'BABY_SHOWER':
            preferred_categories = ['VENUE', 'CATERING', 'CAKE', 'DECORATION']
        elif event_type == 'ANNIVERSARY':
            preferred_categories = ['VENUE', 'CATERING', 'FLOWERS', 'MUSIC', 'PHOTOGRAPHY']
        elif event_type == 'GRADUATION':
            preferred_categories = ['VENUE', 'CATERING', 'PHOTOGRAPHY']
        elif event_type == 'HOLIDAY':
            preferred_categories = ['VENUE', 'CATERING', 'DECORATION', 'MUSIC']
        
        selected_vendor_ids = []
        
        # First, try to match preferred categories
        for vendor_id, data in vendor_data_map.items():
            cursor.execute("SELECT category FROM \"Vendor\" WHERE id = %s", (vendor_id,))
            vendor_category = cursor.fetchone()[0]
            
            if vendor_category in preferred_categories and vendor_id not in selected_vendor_ids and len(selected_vendor_ids) < num_vendors:
                selected_vendor_ids.append(vendor_id)
        
        # Fill remaining slots with random vendors
        remaining_slots = num_vendors - len(selected_vendor_ids)
        if remaining_slots > 0:
            available_vendors = [v for v in vendor_data_map.keys() if v not in selected_vendor_ids]
            if available_vendors:
                selected_vendor_ids.extend(random.sample(available_vendors, min(remaining_slots, len(available_vendors))))
        
        for vendor_id in selected_vendor_ids:
            # Choose a random service from this vendor
            service = random.choice(vendor_data_map[vendor_id]['services'])
            
            # Apply a small discount sometimes
            agreed_price = service['price']
            if random.random() > 0.7:  # 30% chance of discount
                agreed_price = int(agreed_price * 0.9)  # 10% discount
            
            # For events in the past, more likely to have CONFIRMED or PAID status
            if not isinstance(event, dict) or 'id' not in event:
                continue  # Skip if event doesn't have an id
                
            cursor.execute("SELECT date FROM \"Event\" WHERE id = %s", (event['id'],))
            event_date_result = cursor.fetchone()[0]
            
            # Handle date parsing correctly
            if isinstance(event_date_result, str):
                event_date = datetime.strptime(event_date_result, '%Y-%m-%d')
            elif isinstance(event_date_result, date_type):
                event_date = datetime.combine(event_date_result, datetime.min.time())
            else:
                # If we can't parse the date, use current date
                event_date = datetime.now()
            
            if event_date < datetime.now():
                status = random.choices(
                    booking_statuses, 
                    weights=[0.1, 0.4, 0.4, 0.1]  # PENDING, CONFIRMED, PAID, CANCELLED
                )[0]
            else:
                status = random.choices(
                    booking_statuses, 
                    weights=[0.6, 0.3, 0.05, 0.05]  # PENDING, CONFIRMED, PAID, CANCELLED
                )[0]
            
            cursor.execute("""
            INSERT INTO "EventVendor" (eventId, vendorId, serviceId, agreedPrice, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
            """, (event['id'], vendor_id, service['id'], agreed_price, status))
    
    print("  Creating reviews...")
    # Create reviews (only for CONFIRMED or PAID bookings)
    cursor.execute("""
    SELECT ev.id, ev.eventId, ev.vendorId, e.userId
    FROM "EventVendor" ev
    JOIN "Event" e ON ev.eventId = e.id
    WHERE ev.status IN ('CONFIRMED', 'PAID');
    """)
    
    bookings = cursor.fetchall()
    for booking in bookings:
        # 80% chance to have a review
        if random.random() < 0.8:
            booking_id, event_id, vendor_id, user_id = booking
            rating = random.choices(
                [3, 4, 5],  # Mostly positive reviews
                weights=[0.2, 0.3, 0.5]  # More 5-star ratings
            )[0]
            
            review_text = random.choice(review_texts)
            
            # Create a random past date for the review
            review_date = datetime.now() - timedelta(days=random.randint(1, 60))
            
            cursor.execute("""
            INSERT INTO "Review" (userId, vendorId, eventId, rating, reviewText, createdAt)
            VALUES (%s, %s, %s, %s, %s, %s);
            """, (user_id, vendor_id, event_id, rating, review_text, review_date))
    
    conn.commit()
    print("Data seeded successfully")


def main():
    try:
        print(f"Connecting to database with connection string: {DB_URL}")
        
        # Connect to database
        conn = psycopg2.connect(DB_URL)
        print("Database connection established successfully")
        
        # Create tables
        print("Creating database tables...")
        create_tables(conn)
        
        # Seed data
        print("Seeding data (this may take a few minutes)...")
        print("Creating users and vendors...")
        seed_data(conn)
        
        # Close connection
        conn.close()
        print("Database setup completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main() 