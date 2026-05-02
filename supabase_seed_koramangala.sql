-- SURPLUS: Geospatial Realism Seeding Script (Koramangala, Bangalore)
-- Run this in your Supabase SQL Editor to populate the database with realistic test data.

-- 1. Ensure table structure matches the application (adding image_url if missing)
ALTER TABLE public.food_items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Clear existing test data
TRUNCATE TABLE public.food_items RESTART IDENTITY CASCADE;

-- 3. Seed "Available" Items (Pinging on the map)
-- Hotel Empire (Koramangala 5th Block) -> 12.9345, 77.6200
INSERT INTO public.food_items (name, quantity, unit, expires_at, status, lat, lng, image_url)
VALUES 
('Chicken Biryani Surplus', 25, 'kg', now() + interval '4 hours', 'AVAILABLE', 12.9345, 77.6200, '/images/roasted_chicken.png'),
('Kerala Parotas', 100, 'pieces', now() + interval '8 hours', 'AVAILABLE', 12.9345, 77.6200, '/images/artisan_bread.png');

-- Ooty Pastry Shop -> 12.9360, 77.6240
INSERT INTO public.food_items (name, quantity, unit, expires_at, status, lat, lng, image_url)
VALUES 
('Mixed Artisan Pastries', 15, 'pieces', now() + interval '6 hours', 'AVAILABLE', 12.9360, 77.6240, '/images/artisan_bread.png');

-- St. John''s Hospital Canteen -> 12.9300, 77.6180
INSERT INTO public.food_items (name, quantity, unit, expires_at, status, lat, lng, image_url)
VALUES 
('Fresh Milk (Tetra Packs)', 12, 'kg', now() + interval '2 hours', 'AVAILABLE', 12.9300, 77.6180, '/images/prepared_salads.png');

-- The Black Pearl -> 12.9315, 77.6250
INSERT INTO public.food_items (name, quantity, unit, expires_at, status, lat, lng, image_url)
VALUES 
('Buffet Rice & Curry', 30, 'kg', now() + interval '3 hours', 'AVAILABLE', 12.9315, 77.6250, '/images/roasted_chicken.png');


-- 4. Seed "In-Transit" Items (Currently on the road)
INSERT INTO public.food_items (name, quantity, unit, expires_at, status, lat, lng, image_url)
VALUES 
('Vegetable Pulao', 40, 'kg', now() + interval '5 hours', 'IN_TRANSIT', 12.9350, 77.6210, '/images/roasted_chicken.png'),
('Assorted Fruits', 15, 'kg', now() + interval '12 hours', 'IN_TRANSIT', 12.9320, 77.6190, '/images/prepared_salads.png');


-- 5. Seed "Delivered" Items (Historical data for Stats generation)
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..20 LOOP
        INSERT INTO public.food_items (name, quantity, unit, expires_at, status, lat, lng, image_url)
        VALUES (
            'Historical Rescue ' || i,
            floor(random() * 50 + 10)::INT,
            'kg',
            now() - interval '1 day',
            'DELIVERED',
            12.9335 + (random() * 0.01 - 0.005),
            77.6229 + (random() * 0.01 - 0.005),
            '/images/prepared_salads.png'
        );
    END LOOP;
END $$;

-- Summary: 5 Available, 2 In Transit, 20 Delivered.
-- Ready for high-fidelity demonstration in Bangalore!
