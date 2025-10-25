-- Drop existing tables if they exist
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS price_verifications CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS supermarkets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create supermarkets table
CREATE TABLE supermarkets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(10),
    color VARCHAR(20)
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prices table
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    supermarket_id INTEGER REFERENCES supermarkets(id),
    price DECIMAL(10, 2) NOT NULL,
    store_location VARCHAR(200) NOT NULL,
    verification_count INTEGER DEFAULT 1,
    photo_url VARCHAR(500),
    submitted_by INTEGER REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create price_history table for tracking price changes
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    supermarket_id INTEGER REFERENCES supermarkets(id),
    price DECIMAL(10, 2) NOT NULL,
    store_location VARCHAR(200),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recorded_by INTEGER REFERENCES users(id)
);

-- Create price_verifications table
CREATE TABLE price_verifications (
    id SERIAL PRIMARY KEY,
    price_id INTEGER REFERENCES prices(id) ON DELETE CASCADE,
    verified_by INTEGER REFERENCES users(id),
    is_approved BOOLEAN NOT NULL,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_prices_product ON prices(product_id);
CREATE INDEX idx_prices_supermarket ON prices(supermarket_id);
CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_date ON price_history(recorded_at);

-- Insert UK supermarkets
INSERT INTO supermarkets (name, logo, color) VALUES
('Tesco', '🛒', '#00539F'),
('Sainsbury''s', '🛍️', '#EC8A00'),
('Asda', '🏪', '#78BE20'),
('Morrisons', '🏬', '#FFD200'),
('Aldi', '🛒', '#008ECC'),
('Lidl', '🏪', '#0050AA'),
('Waitrose', '🛍️', '#00693E'),
('Co-op', '🏬', '#00B1C9'),
('Iceland', '❄️', '#ED1C24'),
('M&S Food', '🍽️', '#000000');

-- Insert sample user (password: password123)
INSERT INTO users (username, email, password_hash) VALUES
('demo_user', 'demo@example.com', '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u');

-- Insert sample products
INSERT INTO products (name, category, created_by) VALUES
('Whole Milk (2 pints)', 'Dairy', 1),
('Sliced Bread (800g)', 'Bakery', 1),
('Free Range Eggs (6 pack)', 'Dairy', 1),
('Bananas (5 pack)', 'Fruit & Veg', 1),
('Chicken Breast (500g)', 'Meat', 1);

-- Insert sample prices
INSERT INTO prices (product_id, supermarket_id, price, store_location, verification_count, submitted_by, is_verified) VALUES
(1, 1, 1.45, 'London, Oxford Street', 5, 1, true),
(1, 2, 1.50, 'Manchester, Deansgate', 3, 1, true),
(1, 3, 1.35, 'Birmingham, Bull Ring', 4, 1, true),
(1, 5, 1.29, 'Leeds, City Centre', 7, 1, true),
(2, 1, 1.10, 'London, Camden', 6, 1, true),
(2, 2, 1.20, 'Glasgow, Sauchiehall Street', 2, 1, true),
(2, 5, 0.89, 'Liverpool, City Centre', 8, 1, true),
(2, 6, 0.85, 'Edinburgh, Princes Street', 5, 1, true),
(3, 1, 2.25, 'Bristol, Broadmead', 4, 1, true),
(3, 3, 2.15, 'Newcastle, Eldon Square', 3, 1, true),
(3, 4, 2.30, 'Sheffield, The Moor', 2, 1, true),
(3, 7, 2.85, 'Oxford, Headington', 5, 1, true);

-- Insert price history for charts (past 30 days)
INSERT INTO price_history (product_id, supermarket_id, price, store_location, recorded_at, recorded_by) VALUES
-- Milk at Tesco over 30 days
(1, 1, 1.55, 'London, Oxford Street', CURRENT_TIMESTAMP - INTERVAL '30 days', 1),
(1, 1, 1.52, 'London, Oxford Street', CURRENT_TIMESTAMP - INTERVAL '25 days', 1),
(1, 1, 1.50, 'London, Oxford Street', CURRENT_TIMESTAMP - INTERVAL '20 days', 1),
(1, 1, 1.48, 'London, Oxford Street', CURRENT_TIMESTAMP - INTERVAL '15 days', 1),
(1, 1, 1.47, 'London, Oxford Street', CURRENT_TIMESTAMP - INTERVAL '10 days', 1),
(1, 1, 1.45, 'London, Oxford Street', CURRENT_TIMESTAMP - INTERVAL '5 days', 1),
-- Bread at Aldi over 30 days
(2, 5, 0.99, 'Liverpool, City Centre', CURRENT_TIMESTAMP - INTERVAL '30 days', 1),
(2, 5, 0.95, 'Liverpool, City Centre', CURRENT_TIMESTAMP - INTERVAL '25 days', 1),
(2, 5, 0.92, 'Liverpool, City Centre', CURRENT_TIMESTAMP - INTERVAL '20 days', 1),
(2, 5, 0.90, 'Liverpool, City Centre', CURRENT_TIMESTAMP - INTERVAL '15 days', 1),
(2, 5, 0.89, 'Liverpool, City Centre', CURRENT_TIMESTAMP - INTERVAL '10 days', 1),
-- Eggs at Tesco over 30 days
(3, 1, 2.45, 'Bristol, Broadmead', CURRENT_TIMESTAMP - INTERVAL '30 days', 1),
(3, 1, 2.40, 'Bristol, Broadmead', CURRENT_TIMESTAMP - INTERVAL '25 days', 1),
(3, 1, 2.35, 'Bristol, Broadmead', CURRENT_TIMESTAMP - INTERVAL '20 days', 1),
(3, 1, 2.30, 'Bristol, Broadmead', CURRENT_TIMESTAMP - INTERVAL '15 days', 1),
(3, 1, 2.28, 'Bristol, Broadmead', CURRENT_TIMESTAMP - INTERVAL '10 days', 1),
(3, 1, 2.25, 'Bristol, Broadmead', CURRENT_TIMESTAMP - INTERVAL '5 days', 1);
