import os
import psycopg2
import random
from datetime import datetime, timedelta

# Database connection string
DB_URL = "postgresql://neondb_owner:npg_tPq4Rkf1Lsgd@ep-polished-forest-abs4zlmc-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# Event type-specific image collections
event_type_images = {
    'WEDDING': [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6',
        'https://images.unsplash.com/photo-1519741347686-c1e331ec5a10',
        'https://images.unsplash.com/photo-1550005809-91ad75fb315f',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
        'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f',
    ],
    'BIRTHDAY': [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        'https://images.unsplash.com/photo-1464349153735-7db50ed83c84',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176',
        'https://images.unsplash.com/photo-1559456751-057ed33d93d4',
        'https://images.unsplash.com/photo-1557128398-e076a6c64d5f',
        'https://images.unsplash.com/photo-1530088939298-7f77d7f36411',
    ],
    'CORPORATE': [
        'https://images.unsplash.com/photo-1540317580384-e5d43867caa6',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
        'https://images.unsplash.com/photo-1550305080-4e029753abcf',
    ],
    'BABY_SHOWER': [
        'https://images.unsplash.com/photo-1544006659-f0b21884ce1d',
        'https://images.unsplash.com/photo-1615657944000-7dcbc7decb0f',
        'https://images.unsplash.com/photo-1580397581145-cdb6a35b7d3f',
        'https://images.unsplash.com/photo-1532038889905-1b4543ee64f3',
        'https://images.unsplash.com/photo-1581952728358-dac8be11f5a0',
        'https://images.unsplash.com/photo-1528825856829-5e0dceb27eeb',
    ],
    'ANNIVERSARY': [
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a',
        'https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4',
        'https://images.unsplash.com/photo-1523438885200-e635ba2c371e',
        'https://images.unsplash.com/photo-1522673607200-c771acbb4d7e',
        'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1',
        'https://images.unsplash.com/photo-1496309732348-3627f3f040ee',
    ],
    'GRADUATION': [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb',
        'https://images.unsplash.com/photo-1523289961518-a6a2a3d13be2',
        'https://images.unsplash.com/photo-1564750687467-f4348c64c379',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
        'https://images.unsplash.com/photo-1558642891-54be180ea339',
    ],
    'HOLIDAY': [
        'https://images.unsplash.com/photo-1512909006721-3d6018887383',
        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a',
        'https://images.unsplash.com/photo-1543934638-bd2e138a3a68',
        'https://images.unsplash.com/photo-1482517967863-00e15c9b44be',
        'https://images.unsplash.com/photo-1545622783-b3e021430fee',
        'https://images.unsplash.com/photo-1608755728617-aefab37d0a91',
    ],
    'OTHER': [
        'https://images.unsplash.com/photo-1511578314322-379afb476865',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        'https://images.unsplash.com/photo-1496337589254-7e19d01cec44',
        'https://images.unsplash.com/photo-1470753937643-efeb931202a9',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce',
    ],
}

def ensure_events_per_type():
    try:
        conn = psycopg2.connect(DB_URL)
        cursor = conn.cursor()
        
        print("Connected to database")
        
        # Check current event counts by type
        cursor.execute("""
        SELECT event_type, COUNT(*) 
        FROM events 
        GROUP BY event_type
        """)
        
        current_counts = {row[0]: row[1] for row in cursor.fetchall()}
        print(f"Current event counts: {current_counts}")
        
        # Get all customer IDs
        cursor.execute("""
        SELECT id FROM users WHERE role = 'CUSTOMER'
        """)
        
        customer_ids = [row[0] for row in cursor.fetchall()]
        
        if not customer_ids:
            print("No customers found. Creating some customers first...")
            # Create some customers if none exist
            for i in range(10):
                fullname = f"Customer {i+1}"
                email = f"customer{i+1}@example.com"
                phone = f"+1555{random.randint(100000, 999999)}"
                password_hash = "$2b$12$BnvStgpLpTriXzXnU8Bwi.WKEqCsH6DqVRU9Vu6qO1mzVXY/YvFJ."  # 'customer123'
                
                cursor.execute("""
                INSERT INTO users (full_name, email, phone, password_hash, role)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
                """, (fullname, email, phone, password_hash, 'CUSTOMER'))
                
                customer_ids.append(cursor.fetchone()[0])
            
            conn.commit()
        
        # Get locations
        locations = [
            'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
            'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
            'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
        ]
        
        # Ensure at least 20 events for each type
        for event_type, images in event_type_images.items():
            current_count = current_counts.get(event_type, 0)
            needed = max(0, 20 - current_count)
            
            if needed > 0:
                print(f"Creating {needed} new {event_type} events...")
                
                for i in range(needed):
                    # Select random customer
                    user_id = random.choice(customer_ids)
                    
                    # Generate event data
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
                    INSERT INTO events (user_id, event_type, location, date, budget)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                    """, (user_id, event_type, location, event_date.strftime('%Y-%m-%d'), budget))
                    
                    print(f"  Created {event_type} event")
        
        conn.commit()
        
        # Check updated counts
        cursor.execute("""
        SELECT event_type, COUNT(*) 
        FROM events 
        GROUP BY event_type
        """)
        
        updated_counts = {row[0]: row[1] for row in cursor.fetchall()}
        print(f"Updated event counts: {updated_counts}")
        
        conn.close()
        print("Process completed successfully")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    ensure_events_per_type() 