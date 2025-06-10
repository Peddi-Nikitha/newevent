import os
import psycopg2
import random
import bcrypt
from datetime import datetime, timedelta

# Database connection string
DB_URL = "postgresql://neondb_owner:npg_tPq4Rkf1Lsgd@ep-polished-forest-abs4zlmc-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# Vendor profile images by category
vendor_profile_images = {
    'PHOTOGRAPHY': [
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
        'https://images.unsplash.com/photo-1554048612-b6a482bc67e5',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    ],
    'CATERING': [
        'https://images.unsplash.com/photo-1555244162-803834f70033',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf',
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
    ],
    'MUSIC': [
        'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2',
        'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    ],
    'VENUE': [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
        'https://images.unsplash.com/photo-1512800726707-7819aa645a98',
        'https://images.unsplash.com/photo-1604004555489-723a93d6ce74',
    ],
    'DECORATION': [
        'https://images.unsplash.com/photo-1529636798458-92182e662485',
        'https://images.unsplash.com/photo-1561128290-99e8b8e14e6a',
        'https://images.unsplash.com/photo-1510076857177-7470076d4098',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
    ],
    'CAKE': [
        'https://images.unsplash.com/photo-1622467827417-bbe2237067a9',
        'https://images.unsplash.com/photo-1535141192574-5d4897c12636',
        'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5c3',
    ],
    'FLOWERS': [
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364',
        'https://images.unsplash.com/photo-1563241527-3004b7be0ffd',
        'https://images.unsplash.com/photo-1572454591674-2739f30a2e2f',
        'https://images.unsplash.com/photo-1615680022647-99c397cbccae',
    ],
    'DRESS': [
        'https://images.unsplash.com/photo-1550005809-91ad75fb315f',
        'https://images.unsplash.com/photo-1550122658-8d9151cf7a60',
        'https://images.unsplash.com/photo-1600021956340-14a6b28571c3',
        'https://images.unsplash.com/photo-1566174053879-31528523f8cb',
    ],
    'MAKEUP': [
        'https://images.unsplash.com/photo-1470259078422-826894b933aa',
        'https://images.unsplash.com/photo-1522337660859-02fbefca4702',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
        'https://images.unsplash.com/photo-1599687489901-3b0fa8c2568b',
    ],
    'TRANSPORTATION': [
        'https://images.unsplash.com/photo-1586803104882-abe1757369ce',
        'https://images.unsplash.com/photo-1511407397940-d57f68e81203',
        'https://images.unsplash.com/photo-1516055000302-a11419b061a9',
        'https://images.unsplash.com/photo-1652792722666-ffc93d982c2c',
    ],
    'OTHER': [
        'https://images.unsplash.com/photo-1557555187-23d685287bc3',
        'https://images.unsplash.com/photo-1599689018002-8f235eae9293',
        'https://images.unsplash.com/photo-1496843916299-590492c751f4',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
    ],
}

# Vendor categories
vendor_categories = [
    'PHOTOGRAPHY', 'CATERING', 'MUSIC', 'VENUE', 'DECORATION', 
    'CAKE', 'FLOWERS', 'DRESS', 'MAKEUP', 'TRANSPORTATION', 'OTHER'
]

# Locations
locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
    'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
]

# Booking statuses
booking_statuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED']

# Review texts
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

def create_vendors_and_bookings():
    try:
        conn = psycopg2.connect(DB_URL)
        cursor = conn.cursor()
        
        print("Connected to database")
        
        # Check if vendors exist
        cursor.execute("SELECT COUNT(*) FROM vendors")
        vendor_count = cursor.fetchone()[0]
        
        vendor_data_map = {}  # To store vendor IDs and their services
        
        # Create vendors if needed
        if vendor_count < 20:
            print(f"Creating vendors (current count: {vendor_count})...")
            
            # Create at least 3 vendors for each category
            for category in vendor_categories:
                for i in range(3):
                    # Create vendor user
                    full_name = f"{random.choice(['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'])} {category.capitalize()}"
                    email = f"{category.lower()}{i+1}@example.com"
                    phone = f"+1555{random.randint(100000, 999999)}"
                    password_hash = "$2b$12$BnvStgpLpTriXzXnU8Bwi.WKEqCsH6DqVRU9Vu6qO1mzVXY/YvFJ."  # 'vendor123'
                    
                    cursor.execute("""
                    INSERT INTO users (full_name, email, phone, password_hash, role)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                    """, (full_name, email, phone, password_hash, 'VENDOR'))
                    
                    user_id = cursor.fetchone()[0]
                    
                    # Create vendor profile
                    business_name = f"{random.choice(['Elite', 'Premium', 'Luxury', 'Elegant', 'Perfect'])} {category.capitalize()}"
                    location = random.choice(locations)
                    min_price = random.randint(200, 1000)
                    max_price = min_price + random.randint(1000, 8000)
                    rating = round(random.uniform(4.0, 5.0), 1)
                    description = f"Professional {category.lower()} services for all types of events. We specialize in creating memorable experiences that exceed expectations."
                    profile_img = random.choice(vendor_profile_images.get(category, vendor_profile_images['OTHER']))
                    
                    cursor.execute("""
                    INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                    """, (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img))
                    
                    vendor_id = cursor.fetchone()[0]
                    vendor_data_map[vendor_id] = {'services': []}
                    
                    # Create 3 services for this vendor
                    service_names = {
                        'PHOTOGRAPHY': ['Basic Package', 'Premium Package', 'Wedding Special'],
                        'CATERING': ['Buffet Style', 'Plated Dinner', 'Cocktail Reception'],
                        'MUSIC': ['DJ Services', 'Live Band', 'Ceremony Music'],
                        'VENUE': ['Main Hall', 'Garden Package', 'Full Venue Rental'],
                        'DECORATION': ['Basic Decoration', 'Premium Decoration', 'Luxury Package'],
                        'CAKE': ['Standard Cake', 'Custom Design', 'Dessert Table'],
                        'FLOWERS': ['Bridal Package', 'Ceremony Decor', 'Reception Flowers'],
                        'DRESS': ['Designer Collection', 'Custom Design', 'Accessories Package'],
                        'MAKEUP': ['Bridal Makeup', 'Party Package', 'Group Discount'],
                        'TRANSPORTATION': ['Luxury Car', 'Limousine Service', 'Party Bus'],
                        'OTHER': ['Consultation', 'Day-of Coordination', 'Full Planning']
                    }
                    
                    service_titles = service_names.get(category, service_names['OTHER'])
                    
                    for j, title in enumerate(service_titles):
                        price = min_price + (j * random.randint(200, 800))
                        description = f"Professional {title.lower()} service. Includes all necessary equipment and personnel for your event."
                        
                        cursor.execute("""
                        INSERT INTO services (vendor_id, title, description, price)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id;
                        """, (vendor_id, title, description, price))
                        
                        service_id = cursor.fetchone()[0]
                        vendor_data_map[vendor_id]['services'].append({
                            'id': service_id,
                            'price': price
                        })
                    
                    print(f"  Created {category} vendor: {business_name}")
            
            conn.commit()
        else:
            # Load existing vendors and services
            cursor.execute("""
            SELECT v.id, v.category, s.id, s.price 
            FROM vendors v 
            JOIN services s ON s.vendor_id = v.id
            """)
            
            for row in cursor.fetchall():
                vendor_id, category, service_id, price = row
                if vendor_id not in vendor_data_map:
                    vendor_data_map[vendor_id] = {'services': []}
                
                vendor_data_map[vendor_id]['services'].append({
                    'id': service_id,
                    'price': price
                })
            
            print(f"Found {len(vendor_data_map)} existing vendors")
        
        # Get all events
        cursor.execute("""
        SELECT id, event_type, user_id, date 
        FROM events 
        ORDER BY event_type
        """)
        
        events = cursor.fetchall()
        print(f"Found {len(events)} events")
        
        # Check for existing bookings
        cursor.execute("SELECT COUNT(*) FROM event_vendors")
        booking_count = cursor.fetchone()[0]
        
        if booking_count < 100:
            print(f"Creating bookings (current count: {booking_count})...")
            
            # Create bookings for events
            bookings_created = 0
            
            for event_id, event_type, user_id, event_date in events:
                # Skip if this event already has bookings
                cursor.execute("SELECT COUNT(*) FROM event_vendors WHERE event_id = %s", (event_id,))
                if cursor.fetchone()[0] > 0:
                    continue
                
                # Determine appropriate vendor categories for this event type
                preferred_categories = []
                
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
                else:
                    preferred_categories = random.sample(vendor_categories, 3)
                
                # Choose 2-4 vendors for this event
                num_vendors = random.randint(2, 4)
                selected_vendor_ids = []
                
                # Find vendors in preferred categories
                for category in preferred_categories:
                    cursor.execute("SELECT id FROM vendors WHERE category = %s ORDER BY RANDOM() LIMIT 1", (category,))
                    result = cursor.fetchone()
                    if result and len(selected_vendor_ids) < num_vendors:
                        selected_vendor_ids.append(result[0])
                
                # Fill remaining slots with random vendors
                if len(selected_vendor_ids) < num_vendors:
                    remaining_slots = num_vendors - len(selected_vendor_ids)
                    cursor.execute("""
                    SELECT id FROM vendors 
                    WHERE id NOT IN %s 
                    ORDER BY RANDOM() LIMIT %s
                    """, (tuple(selected_vendor_ids) if selected_vendor_ids else ('0',), remaining_slots))
                    
                    for row in cursor.fetchall():
                        selected_vendor_ids.append(row[0])
                
                # Create bookings for selected vendors
                for vendor_id in selected_vendor_ids:
                    if vendor_id in vendor_data_map and vendor_data_map[vendor_id]['services']:
                        # Choose a random service
                        service = random.choice(vendor_data_map[vendor_id]['services'])
                        
                        # Apply a small discount sometimes
                        agreed_price = service['price']
                        if random.random() > 0.7:  # 30% chance of discount
                            agreed_price = int(agreed_price * 0.9)  # 10% discount
                        
                        # Set appropriate status based on event date
                        if event_date < datetime.now().date():
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
                        INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id;
                        """, (event_id, vendor_id, service['id'], agreed_price, status))
                        
                        bookings_created += 1
                
                # Create reviews for past events with CONFIRMED or PAID status
                if event_date < datetime.now().date():
                    cursor.execute("""
                    SELECT ev.id, ev.vendor_id 
                    FROM event_vendors ev
                    WHERE ev.event_id = %s AND ev.status IN ('CONFIRMED', 'PAID')
                    """, (event_id,))
                    
                    for booking_id, vendor_id in cursor.fetchall():
                        # 80% chance to have a review
                        if random.random() < 0.8:
                            rating = random.choices(
                                [3, 4, 5],  # Mostly positive reviews
                                weights=[0.2, 0.3, 0.5]  # More 5-star ratings
                            )[0]
                            
                            review_text = random.choice(review_texts)
                            
                            # Create a random past date for the review
                            review_date = datetime.now() - timedelta(days=random.randint(1, 60))
                            
                            cursor.execute("""
                            INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text, created_at)
                            VALUES (%s, %s, %s, %s, %s, %s);
                            """, (user_id, vendor_id, event_id, rating, review_text, review_date))
            
            conn.commit()
            print(f"Created {bookings_created} new bookings")
        else:
            print(f"Sufficient bookings exist ({booking_count})")
        
        # Update vendor ratings based on reviews
        cursor.execute("""
        UPDATE vendors v
        SET rating = (
            SELECT COALESCE(AVG(rating), 4.5)
            FROM reviews r
            WHERE r.vendor_id = v.id
        )
        """)
        
        conn.commit()
        print("Vendor ratings updated based on reviews")
        
        conn.close()
        print("Process completed successfully")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_vendors_and_bookings() 