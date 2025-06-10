import psycopg2

# Database connection string
DB_URL = "postgresql://neondb_owner:npg_tPq4Rkf1Lsgd@ep-polished-forest-abs4zlmc-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

def check_db_status():
    try:
        conn = psycopg2.connect(DB_URL)
        cursor = conn.cursor()
        
        print("Connected to database successfully")
        
        # Check vendors
        cursor.execute("SELECT COUNT(*) FROM vendors")
        vendor_count = cursor.fetchone()[0]
        print(f"Vendors: {vendor_count}")
        
        # Check events by type
        cursor.execute("SELECT event_type, COUNT(*) FROM events GROUP BY event_type")
        print("\nEvent counts by type:")
        for row in cursor.fetchall():
            print(f"{row[0]}: {row[1]}")
        
        # Check total events
        cursor.execute("SELECT COUNT(*) FROM events")
        event_count = cursor.fetchone()[0]
        print(f"\nTotal Events: {event_count}")
        
        # Check bookings
        cursor.execute("SELECT COUNT(*) FROM event_vendors")
        booking_count = cursor.fetchone()[0]
        print(f"Bookings: {booking_count}")
        
        # Check reviews
        cursor.execute("SELECT COUNT(*) FROM reviews")
        review_count = cursor.fetchone()[0]
        print(f"Reviews: {review_count}")
        
        # Check services
        cursor.execute("SELECT COUNT(*) FROM services")
        service_count = cursor.fetchone()[0]
        print(f"Services: {service_count}")
        
        # Sample event with image
        print("\nSample event data:")
        cursor.execute("""
        SELECT e.id, e.event_type, e.location, e.date, e.budget, u.full_name
        FROM events e
        JOIN users u ON e.user_id = u.id
        LIMIT 1
        """)
        event = cursor.fetchone()
        if event:
            print(f"Event ID: {event[0]}")
            print(f"Type: {event[1]}")
            print(f"Location: {event[2]}")
            print(f"Date: {event[3]}")
            print(f"Budget: ${event[4]}")
            print(f"User: {event[5]}")
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db_status() 