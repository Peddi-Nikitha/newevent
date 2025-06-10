import os
import psycopg2
import bcrypt
import random
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
DB_URL = os.getenv("DATABASE_URL")

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

def create_tables(conn):
    """Create database tables"""
    cursor = conn.cursor()
    
    # Drop existing tables if they exist (in reverse order to avoid foreign key constraints)
    cursor.execute("""
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS event_vendors CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS services CASCADE;
    DROP TABLE IF EXISTS vendors CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    """)

    # Create users table
    cursor.execute("""
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(255),
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    # Create vendors table
    cursor.execute("""
    CREATE TABLE vendors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('PHOTOGRAPHY', 'CATERING', 'MUSIC', 'VENUE', 'DECORATION', 'CAKE', 'FLOWERS', 'DRESS', 'MAKEUP', 'TRANSPORTATION', 'OTHER')),
        location VARCHAR(255) NOT NULL,
        min_price INT NOT NULL,
        max_price INT NOT NULL,
        rating FLOAT DEFAULT 0,
        description TEXT NOT NULL,
        profile_img TEXT
    );
    """)

    # Create services table
    cursor.execute("""
    CREATE TABLE services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INT NOT NULL,
        availability JSONB
    );
    """)

    # Create events table
    cursor.execute("""
    CREATE TABLE events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('WEDDING', 'BIRTHDAY', 'CORPORATE', 'BABY_SHOWER', 'ANNIVERSARY', 'GRADUATION', 'HOLIDAY', 'OTHER')),
        location VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        budget INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    # Create event_vendors table (bookings)
    cursor.execute("""
    CREATE TABLE event_vendors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
        service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        agreed_price INT NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    """)

    # Create reviews table
    cursor.execute("""
    CREATE TABLE reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
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
    
    # Create admin user
    admin_password = hash_password('admin123')
    cursor.execute("""
    INSERT INTO users (full_name, email, phone, password_hash, role)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id;
    """, ('Admin User', 'admin@happyhappenings.com', '+1234567890', admin_password, 'ADMIN'))
    
    # Create customer users
    customers = [
        ('John Customer', 'customer1@example.com', '+1987654321', hash_password('customer123'), 'CUSTOMER'),
        ('Jane Smith', 'customer2@example.com', '+1555123456', hash_password('customer123'), 'CUSTOMER'),
        ('Robert Johnson', 'customer3@example.com', '+1555789012', hash_password('customer123'), 'CUSTOMER')
    ]
    
    customer_ids = []
    for customer in customers:
        cursor.execute("""
        INSERT INTO users (full_name, email, phone, password_hash, role)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """, customer)
        customer_ids.append(cursor.fetchone()[0])
    
    # Create vendor users and their profiles
    vendors_data = [
        {
            'user': ('Mike Photographer', 'photographer@example.com', '+1567891234', hash_password('vendor123'), 'VENDOR'),
            'profile': ('Perfect Shots Photography', 'PHOTOGRAPHY', 'New York, NY', 500, 3000, 4.8, 
                        'Professional photography services for all types of events. We capture your special moments with artistic vision and technical excellence.',
                        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e'),
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
                       'https://images.unsplash.com/photo-1555244162-803834f70033'),
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
                       'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'),
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
                       'https://images.unsplash.com/photo-1561181286-d3fee7d55364'),
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
                       'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2'),
            'services': [
                ('Basic DJ Package', '4 hours of music, professional DJ, basic lighting, sound system', 800),
                ('Premium DJ Package', '6 hours of music, professional DJ, advanced lighting, sound system, MC services', 1500),
                ('Ultimate Party Package', '8 hours of music, professional DJ, premium lighting, sound system, MC services, photo booth', 2500)
            ]
        }
    ]
    
    vendor_data_map = {}  # To store vendor IDs and their services for later use
    
    for vendor in vendors_data:
        # Create vendor user
        cursor.execute("""
        INSERT INTO users (full_name, email, phone, password_hash, role)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """, vendor['user'])
        
        user_id = cursor.fetchone()[0]
        
        # Create vendor profile
        cursor.execute("""
        INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """, (user_id, *vendor['profile']))
        
        vendor_id = cursor.fetchone()[0]
        vendor_data_map[vendor_id] = {'services': []}
        
        # Create vendor services
        for service in vendor['services']:
            cursor.execute("""
            INSERT INTO services (vendor_id, title, description, price)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
            """, (vendor_id, *service))
            
            service_id = cursor.fetchone()[0]
            vendor_data_map[vendor_id]['services'].append({
                'id': service_id,
                'price': service[2]
            })
    
    # Create events
    events = []
    for i, customer_id in enumerate(customer_ids):
        # Create 1-2 events per customer
        for _ in range(random.randint(1, 2)):
            event_date = datetime.now() + timedelta(days=random.randint(30, 365))
            event_type = random.choice(event_types)
            location = random.choice(locations)
            budget = random.randint(5000, 30000)
            
            cursor.execute("""
            INSERT INTO events (user_id, event_type, location, date, budget)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
            """, (customer_id, event_type, location, event_date.strftime('%Y-%m-%d'), budget))
            
            event_id = cursor.fetchone()[0]
            events.append({
                'id': event_id,
                'user_id': customer_id
            })
    
    # Create bookings (event_vendors)
    for event in events:
        # Choose 1-3 random vendors for each event
        selected_vendor_ids = random.sample(list(vendor_data_map.keys()), random.randint(1, 3))
        
        for vendor_id in selected_vendor_ids:
            # Choose a random service from this vendor
            service = random.choice(vendor_data_map[vendor_id]['services'])
            
            # Apply a small discount sometimes
            agreed_price = service['price']
            if random.random() > 0.7:  # 30% chance of discount
                agreed_price = int(agreed_price * 0.9)  # 10% discount
            
            status = random.choice(booking_statuses)
            
            cursor.execute("""
            INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
            """, (event['id'], vendor_id, service['id'], agreed_price, status))
    
    # Create reviews (only for CONFIRMED or PAID bookings)
    cursor.execute("""
    SELECT ev.id, ev.event_id, ev.vendor_id, e.user_id
    FROM event_vendors ev
    JOIN events e ON ev.event_id = e.id
    WHERE ev.status IN ('CONFIRMED', 'PAID');
    """)
    
    bookings = cursor.fetchall()
    for booking in bookings:
        # 80% chance to have a review
        if random.random() < 0.8:
            booking_id, event_id, vendor_id, user_id = booking
            rating = random.randint(3, 5)  # Mostly positive reviews
            
            review_texts = [
                "Great service! Highly recommended.",
                "Excellent vendor, very professional.",
                "They made our special day perfect!",
                "Exceeded our expectations in every way.",
                "Very responsive and easy to work with.",
                "Good service, but a bit pricey.",
                "Amazing! Will definitely use again for future events."
            ]
            
            review_text = random.choice(review_texts)
            
            cursor.execute("""
            INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
            VALUES (%s, %s, %s, %s, %s);
            """, (user_id, vendor_id, event_id, rating, review_text))
    
    conn.commit()
    print("Data seeded successfully")


def main():
    try:
        # Connect to database
        conn = psycopg2.connect(DB_URL)
        
        # Create tables
        create_tables(conn)
        
        # Seed data
        seed_data(conn)
        
        # Close connection
        conn.close()
        print("Database setup completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main() 