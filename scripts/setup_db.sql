-- Drop existing tables if they exist (in reverse order to avoid foreign key constraints)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS event_vendors CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
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

-- Create vendors table
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

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    availability JSONB
);

-- Create events table
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

-- Create event_vendors table (bookings)
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

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert sample data

-- Admin user
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES ('Admin User', 'admin@happyhappenings.com', '+1234567890', '$2b$12$1234567890123456789012', 'ADMIN');

-- Customer users
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES 
('John Customer', 'customer1@example.com', '+1987654321', '$2b$12$1234567890123456789012', 'CUSTOMER'),
('Jane Smith', 'customer2@example.com', '+1555123456', '$2b$12$1234567890123456789012', 'CUSTOMER'),
('Robert Johnson', 'customer3@example.com', '+1555789012', '$2b$12$1234567890123456789012', 'CUSTOMER');

-- Vendor users
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES 
('Mike Photographer', 'photographer@example.com', '+1567891234', '$2b$12$1234567890123456789012', 'VENDOR'),
('Lisa Caterer', 'catering@example.com', '+1456789123', '$2b$12$1234567890123456789012', 'VENDOR'),
('Robert Venue', 'venue@example.com', '+1345678912', '$2b$12$1234567890123456789012', 'VENDOR'),
('Maria Florist', 'florist@example.com', '+1234561234', '$2b$12$1234567890123456789012', 'VENDOR'),
('James DJ', 'dj@example.com', '+1789456123', '$2b$12$1234567890123456789012', 'VENDOR');

-- Get user IDs
DO $$
DECLARE
    admin_id UUID;
    customer1_id UUID;
    customer2_id UUID;
    customer3_id UUID;
    photographer_id UUID;
    caterer_id UUID;
    venue_id UUID;
    florist_id UUID;
    dj_id UUID;
    
    -- Vendor IDs after creation
    photography_vendor_id UUID;
    catering_vendor_id UUID;
    venue_vendor_id UUID;
    florist_vendor_id UUID;
    dj_vendor_id UUID;
    
    -- Service IDs
    photo_service1_id UUID;
    photo_service2_id UUID;
    photo_service3_id UUID;
    catering_service1_id UUID;
    catering_service2_id UUID;
    catering_service3_id UUID;
    venue_service1_id UUID;
    venue_service2_id UUID;
    venue_service3_id UUID;
    florist_service1_id UUID;
    florist_service2_id UUID;
    florist_service3_id UUID;
    dj_service1_id UUID;
    dj_service2_id UUID;
    dj_service3_id UUID;
    
    -- Event IDs
    event1_id UUID;
    event2_id UUID;
    event3_id UUID;
    event4_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO admin_id FROM users WHERE email = 'admin@happyhappenings.com';
    SELECT id INTO customer1_id FROM users WHERE email = 'customer1@example.com';
    SELECT id INTO customer2_id FROM users WHERE email = 'customer2@example.com';
    SELECT id INTO customer3_id FROM users WHERE email = 'customer3@example.com';
    SELECT id INTO photographer_id FROM users WHERE email = 'photographer@example.com';
    SELECT id INTO caterer_id FROM users WHERE email = 'catering@example.com';
    SELECT id INTO venue_id FROM users WHERE email = 'venue@example.com';
    SELECT id INTO florist_id FROM users WHERE email = 'florist@example.com';
    SELECT id INTO dj_id FROM users WHERE email = 'dj@example.com';
    
    -- Create vendor profiles
    INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
    VALUES (photographer_id, 'Perfect Shots Photography', 'PHOTOGRAPHY', 'New York, NY', 500, 3000, 4.8, 
           'Professional photography services for all types of events. We capture your special moments with artistic vision and technical excellence.',
           'https://images.unsplash.com/photo-1542038784456-1ea8e935640e')
    RETURNING id INTO photography_vendor_id;
    
    INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
    VALUES (caterer_id, 'Delicious Bites Catering', 'CATERING', 'Los Angeles, CA', 1000, 10000, 4.6,
           'We provide delicious food for all types of events. From casual to gourmet, we have menu options to fit every taste and budget.',
           'https://images.unsplash.com/photo-1555244162-803834f70033')
    RETURNING id INTO catering_vendor_id;
    
    INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
    VALUES (venue_id, 'Elegant Events Hall', 'VENUE', 'Chicago, IL', 2000, 15000, 4.9,
           'A beautiful venue for weddings, corporate events, and special celebrations. Our elegant space can accommodate both intimate gatherings and large parties.',
           'https://images.unsplash.com/photo-1519167758481-83f550bb49b3')
    RETURNING id INTO venue_vendor_id;
    
    INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
    VALUES (florist_id, 'Blooming Creations', 'FLOWERS', 'San Francisco, CA', 300, 5000, 4.7,
           'Beautiful floral arrangements for any occasion. We specialize in weddings, events, and custom arrangements that will make your special day unforgettable.',
           'https://images.unsplash.com/photo-1561181286-d3fee7d55364')
    RETURNING id INTO florist_vendor_id;
    
    INSERT INTO vendors (user_id, business_name, category, location, min_price, max_price, rating, description, profile_img)
    VALUES (dj_id, 'Elite Sound Entertainment', 'MUSIC', 'Miami, FL', 800, 2500, 4.5,
           'Professional DJ services for all types of events. We bring the perfect music, lighting, and energy to make your event memorable.',
           'https://images.unsplash.com/photo-1571266028253-6c4c86f9b2b2')
    RETURNING id INTO dj_vendor_id;
    
    -- Create services for photography vendor
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (photography_vendor_id, 'Basic Wedding Package', '6 hours of coverage, 1 photographer, 200 edited digital photos, online gallery', 1200)
    RETURNING id INTO photo_service1_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (photography_vendor_id, 'Premium Wedding Package', '10 hours of coverage, 2 photographers, engagement session, 500 edited digital photos, online gallery, wedding album', 2500)
    RETURNING id INTO photo_service2_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (photography_vendor_id, 'Corporate Event Coverage', '4 hours of coverage, 1 photographer, 100 edited digital photos, online gallery', 800)
    RETURNING id INTO photo_service3_id;
    
    -- Create services for catering vendor
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (catering_vendor_id, 'Buffet Style - Standard', 'Selection of appetizers, 2 main courses, 3 sides, dessert. $25 per person, 50 person minimum', 1250)
    RETURNING id INTO catering_service1_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (catering_vendor_id, 'Plated Dinner - Premium', 'Elegant plated service with 3-course meal including appetizer, main course, and dessert. $45 per person, 30 person minimum', 1350)
    RETURNING id INTO catering_service2_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (catering_vendor_id, 'Cocktail Reception', 'Passed hors d''oeuvres, charcuterie display, and beverage service. $35 per person, 40 person minimum', 1400)
    RETURNING id INTO catering_service3_id;
    
    -- Create services for venue vendor
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (venue_vendor_id, 'Grand Ballroom - Weekend', 'Our largest space accommodating up to 300 guests. Includes tables, chairs, basic linens, and setup/cleanup. Available Friday-Sunday.', 6000)
    RETURNING id INTO venue_service1_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (venue_vendor_id, 'Grand Ballroom - Weekday', 'Our largest space accommodating up to 300 guests. Includes tables, chairs, basic linens, and setup/cleanup. Available Monday-Thursday.', 4000)
    RETURNING id INTO venue_service2_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (venue_vendor_id, 'Garden Terrace', 'Beautiful outdoor space for ceremonies or receptions. Accommodates up to 150 guests. Includes garden chairs and setup/cleanup.', 3500)
    RETURNING id INTO venue_service3_id;
    
    -- Create services for florist vendor
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (florist_vendor_id, 'Bridal Package', 'Bridal bouquet, 4 bridesmaid bouquets, 8 boutonnières, 2 corsages', 1200)
    RETURNING id INTO florist_service1_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (florist_vendor_id, 'Ceremony Decor', 'Altar/chuppah arrangement, 6 aisle arrangements, petals for flower girl', 850)
    RETURNING id INTO florist_service2_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (florist_vendor_id, 'Reception Centerpieces', '10 table centerpieces, head table garland, cake flowers', 1500)
    RETURNING id INTO florist_service3_id;
    
    -- Create services for DJ vendor
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (dj_vendor_id, 'Basic DJ Package', '4 hours of music, professional DJ, basic lighting, sound system', 800)
    RETURNING id INTO dj_service1_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (dj_vendor_id, 'Premium DJ Package', '6 hours of music, professional DJ, advanced lighting, sound system, MC services', 1500)
    RETURNING id INTO dj_service2_id;
    
    INSERT INTO services (vendor_id, title, description, price)
    VALUES (dj_vendor_id, 'Ultimate Party Package', '8 hours of music, professional DJ, premium lighting, sound system, MC services, photo booth', 2500)
    RETURNING id INTO dj_service3_id;
    
    -- Create events
    INSERT INTO events (user_id, event_type, location, date, budget)
    VALUES (customer1_id, 'WEDDING', 'New York, NY', '2023-12-15', 15000)
    RETURNING id INTO event1_id;
    
    INSERT INTO events (user_id, event_type, location, date, budget)
    VALUES (customer2_id, 'BIRTHDAY', 'Los Angeles, CA', '2023-11-20', 5000)
    RETURNING id INTO event2_id;
    
    INSERT INTO events (user_id, event_type, location, date, budget)
    VALUES (customer3_id, 'CORPORATE', 'Chicago, IL', '2024-01-10', 20000)
    RETURNING id INTO event3_id;
    
    INSERT INTO events (user_id, event_type, location, date, budget)
    VALUES (customer1_id, 'GRADUATION', 'Houston, TX', '2024-05-25', 7500)
    RETURNING id INTO event4_id;
    
    -- Create bookings
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event1_id, photography_vendor_id, photo_service2_id, 2500, 'CONFIRMED');
    
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event1_id, venue_vendor_id, venue_service1_id, 6000, 'CONFIRMED');
    
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event2_id, dj_vendor_id, dj_service1_id, 800, 'PAID');
    
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event3_id, venue_vendor_id, venue_service1_id, 6000, 'PENDING');
    
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event3_id, catering_vendor_id, catering_service2_id, 1350, 'CONFIRMED');
    
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event4_id, catering_vendor_id, catering_service1_id, 1250, 'PAID');
    
    INSERT INTO event_vendors (event_id, vendor_id, service_id, agreed_price, status)
    VALUES (event4_id, florist_vendor_id, florist_service3_id, 1500, 'CONFIRMED');
    
    -- Create reviews for confirmed or paid bookings
    INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
    VALUES (customer1_id, photography_vendor_id, event1_id, 5, 'Great service! Highly recommended.');
    
    INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
    VALUES (customer1_id, venue_vendor_id, event1_id, 4, 'Beautiful venue, but a bit pricey.');
    
    INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
    VALUES (customer2_id, dj_vendor_id, event2_id, 5, 'Amazing DJ! Everyone loved the music.');
    
    INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
    VALUES (customer3_id, catering_vendor_id, event3_id, 4, 'The food was delicious. Very professional service.');
    
    INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
    VALUES (customer1_id, catering_vendor_id, event4_id, 5, 'Everyone loved the food. Will definitely use again.');
    
    INSERT INTO reviews (user_id, vendor_id, event_id, rating, review_text)
    VALUES (customer1_id, florist_vendor_id, event4_id, 5, 'Beautiful arrangements! Exceeded our expectations.');
END $$; 