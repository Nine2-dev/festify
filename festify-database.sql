-- =====================================================
-- FESTIFY - College Festival Ticket & Seat Booking System
-- Complete Database Schema
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS fest_booking;
USE fest_booking;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_verified BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    year_of_study INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. VENUES TABLE
-- =====================================================
CREATE TABLE venues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(150) NOT NULL UNIQUE,
    address TEXT,
    total_capacity INT NOT NULL,
    has_numbered_seats BOOLEAN DEFAULT TRUE,
    seating_layout_json TEXT,
    facilities TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_venue_name (venue_name),
    INDEX idx_capacity (total_capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. EVENTS TABLE
-- =====================================================
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) CHECK (event_type IN ('MUSIC', 'TECH', 'SPORTS', 'CULTURAL', 'ACADEMIC', 'OTHER')),
    venue_id BIGINT NOT NULL,
    event_date DATETIME NOT NULL,
    duration_minutes INT,
    banner_image_url VARCHAR(500),
    organizer_name VARCHAR(100),
    max_capacity INT NOT NULL,
    booking_opens_at DATETIME,
    booking_closes_at DATETIME,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'PUBLISHED', 'BOOKING_OPEN', 'INACTIVE', 'SOLD_OUT', 'BOOKING_CLOSED', 'COMPLETED', 'CANCELLED')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE RESTRICT,
    INDEX idx_event_date (event_date),
    INDEX idx_status (status),
    INDEX idx_venue_id (venue_id),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. PRICE_TIERS TABLE
-- =====================================================
CREATE TABLE price_tiers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    seat_range_start VARCHAR(10),
    seat_range_end VARCHAR(10),
    color_code VARCHAR(7),
    valid_until DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_tier (event_id, tier_name),
    INDEX idx_event_id (event_id),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. BOOKINGS TABLE (Core Transactional Table)
-- =====================================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    price_tier_id BIGINT NOT NULL,
    num_tickets INT NOT NULL CHECK (num_tickets > 0),
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (booking_status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('UPI', 'CARD', 'NETBANKING', 'WALLET')),
    payment_transaction_id VARCHAR(100) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    booked_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    confirmed_at DATETIME(6),
    expires_at DATETIME(6),
    qr_code_data TEXT,
    version INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (price_tier_id) REFERENCES price_tiers(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_booking_status (booking_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booked_at (booked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. SEAT_RESERVATIONS TABLE
-- =====================================================
CREATE TABLE seat_reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    price_tier_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    row_number VARCHAR(5),
    section VARCHAR(20),
    reservation_status VARCHAR(50) NOT NULL DEFAULT 'RESERVED' CHECK (reservation_status IN ('RESERVED', 'CONFIRMED', 'RELEASED')),
    reserved_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    confirmed_at DATETIME(6),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (price_tier_id) REFERENCES price_tiers(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_event_seat (event_id, seat_number),
    INDEX idx_booking_id (booking_id),
    INDEX idx_event_seat (event_id, seat_number),
    INDEX idx_reservation_status (reservation_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TRANSACTIONS TABLE (Payment Log)
-- =====================================================
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    booking_reference VARCHAR(20),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('PAYMENT', 'REFUND', 'WALLET_CREDIT', 'WALLET_DEBIT')),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('UPI', 'CARD', 'NETBANKING', 'WALLET')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    payment_gateway_response TEXT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. WALLETS TABLE (User Balance)
-- =====================================================
CREATE TABLE wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'INR',
    last_transaction_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    CHECK (balance >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. WAITING_LIST TABLE
-- =====================================================
CREATE TABLE waiting_list (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'PROMOTED', 'CANCELLED')),
    promoted_at DATETIME,
    cancelled_at DATETIME,
    notes VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_joined_at (joined_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Revenue by Event
CREATE VIEW v_event_revenue AS
SELECT 
    e.id,
    e.event_name,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    AVG(b.total_amount) as avg_booking_value,
    COUNT(DISTINCT b.user_id) as unique_customers
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id AND b.booking_status = 'CONFIRMED'
GROUP BY e.id, e.event_name;

-- Booking Summary by User
CREATE VIEW v_user_bookings AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_spent,
    MAX(b.booked_at) as last_booking_date
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id AND b.booking_status = 'CONFIRMED'
GROUP BY u.id, u.full_name, u.email;

-- Tier Performance
CREATE VIEW v_tier_performance AS
SELECT 
    pt.id,
    pt.tier_name,
    e.event_name,
    pt.total_seats,
    (pt.total_seats - pt.available_seats) as seats_sold,
    pt.available_seats,
    ROUND(((pt.total_seats - pt.available_seats) / pt.total_seats * 100), 2) as occupancy_rate,
    SUM(b.total_amount) as tier_revenue,
    COUNT(b.id) as tier_bookings
FROM price_tiers pt
JOIN events e ON pt.event_id = e.id
LEFT JOIN bookings b ON pt.id = b.price_tier_id AND b.booking_status = 'CONFIRMED'
GROUP BY pt.id, pt.tier_name, e.event_name, pt.total_seats, pt.available_seats;

-- Venue Usage
CREATE VIEW v_venue_usage AS
SELECT 
    v.id,
    v.venue_name,
    v.total_capacity,
    COUNT(DISTINCT e.id) as events_hosted,
    COUNT(DISTINCT b.id) as total_bookings,
    SUM(b.total_amount) as venue_revenue
FROM venues v
LEFT JOIN events e ON v.id = e.venue_id
LEFT JOIN bookings b ON e.id = b.event_id AND b.booking_status = 'CONFIRMED'
GROUP BY v.id, v.venue_name, v.total_capacity;

-- =====================================================
-- INDEXES FOR OPTIMIZATION
-- =====================================================

-- Additional composite indexes
ALTER TABLE bookings ADD INDEX idx_user_event (user_id, event_id);
ALTER TABLE bookings ADD INDEX idx_status_date (booking_status, booked_at);
ALTER TABLE price_tiers ADD INDEX idx_event_available (event_id, available_seats);
ALTER TABLE seat_reservations ADD INDEX idx_tier_status (price_tier_id, reservation_status);
ALTER TABLE transactions ADD INDEX idx_user_type (user_id, transaction_type);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample users
INSERT INTO users (email, password, full_name, phone_number, role, department, year_of_study, is_verified) VALUES
('student1@fest.com', 'hashed_password_1', 'Arjun Kumar', '9876543210', 'USER', 'Computer Science', 2, TRUE),
('student2@fest.com', 'hashed_password_2', 'Priya Sharma', '9876543211', 'USER', 'Electronics', 3, TRUE),
('student3@fest.com', 'hashed_password_3', 'Raj Patel', '9876543212', 'USER', 'Mechanical', 1, TRUE),
('admin@fest.com', 'hashed_admin_password', 'Admin User', '9999999999', 'ADMIN', NULL, NULL, TRUE);

-- Insert sample venues
INSERT INTO venues (venue_name, address, total_capacity, has_numbered_seats, facilities) VALUES
('Main Auditorium', 'Campus Central Building', 1000, TRUE, 'Stage, Sound System, Projection, AC'),
('Open Ground', 'Sports Complex East', 2000, FALSE, 'Open Air Space, Parking Lot, Restrooms'),
('Tech Conference Hall', 'IT Building Ground Floor', 500, TRUE, 'WiFi, Projectors, Charging Stations, Seating'),
('Indoor Stadium', 'Sports Complex West', 1500, FALSE, 'Basketball Court, Sound System, Bleachers'),
('Seminar Hall A', 'Admin Building', 200, TRUE, 'Projector, AC, Whiteboard Facilities');

-- Insert sample events
INSERT INTO events (event_name, description, event_type, venue_id, event_date, duration_minutes, organizer_name, max_capacity, booking_opens_at, booking_closes_at, status) VALUES
('College Concert 2026', 'Annual music festival featuring top college artists and bands', 'MUSIC', 1, '2026-06-15 19:00:00', 180, 'Cultural Committee', 1000, '2026-05-01 10:00:00', '2026-06-14 23:59:59', 'PUBLISHED'),
('Tech Summit 2026', 'Innovation and technology conference with industry experts', 'TECH', 3, '2026-07-20 09:00:00', 480, 'Tech Club', 500, '2026-06-01 10:00:00', '2026-07-19 23:59:59', 'PUBLISHED'),
('Annual Sports Day', 'Inter-college sports competition across multiple events', 'SPORTS', 4, '2026-08-10 08:00:00', 600, 'Sports Department', 1500, '2026-06-15 10:00:00', '2026-08-09 23:59:59', 'ACTIVE'),
('Cultural Festival', 'Dance, drama, and cultural performances from around the region', 'CULTURAL', 2, '2026-09-05 17:00:00', 240, 'International Office', 2000, '2026-07-20 10:00:00', '2026-09-04 23:59:59', 'PUBLISHED'),
('Freshers Party', 'Welcome event for new batch of students', 'CULTURAL', 1, '2026-05-20 18:00:00', 180, 'Student Council', 1000, '2026-05-01 10:00:00', '2026-05-19 23:59:59', 'BOOKING_CLOSED');

-- Insert sample price tiers
INSERT INTO price_tiers (event_id, tier_name, price, total_seats, available_seats, seat_range_start, seat_range_end, color_code) VALUES
(1, 'Early Bird', 299, 200, 150, 'A1', 'A200', '#FF6B6B'),
(1, 'Regular', 499, 500, 300, 'B1', 'F500', '#4ECDC4'),
(1, 'VIP', 999, 300, 200, 'G1', 'J300', '#FFE66D'),
(2, 'Student Pass', 199, 250, 180, 'A1', 'A250', '#95E1D3'),
(2, 'Professional Pass', 799, 250, 100, 'B1', 'B250', '#F38181'),
(3, 'General Entry', 0, 1500, 900, NULL, NULL, '#A8E6CF'),
(4, 'Standard', 399, 1000, 600, 'A1', 'A1000', '#FFD3B6'),
(4, 'Premium', 799, 1000, 500, 'B1', 'B1000', '#FFAAA5'),
(5, 'General', 99, 1000, 750, 'A1', 'J1000', '#FF8B94');

-- Insert sample bookings
INSERT INTO bookings (booking_reference, user_id, event_id, price_tier_id, num_tickets, total_amount, booking_status, payment_method, payment_status, booked_at, confirmed_at) VALUES
('FEST-2026-0001', 1, 1, 2, 2, 998, 'CONFIRMED', 'CARD', 'SUCCESS', '2026-05-10 14:30:00', '2026-05-10 14:35:00'),
('FEST-2026-0002', 1, 2, 4, 1, 199, 'CONFIRMED', 'UPI', 'SUCCESS', '2026-05-11 10:15:00', '2026-05-11 10:16:00'),
('FEST-2026-0003', 2, 1, 3, 1, 999, 'CONFIRMED', 'NETBANKING', 'SUCCESS', '2026-05-12 16:45:00', '2026-05-12 16:46:00'),
('FEST-2026-0004', 2, 4, 7, 3, 1197, 'PENDING_PAYMENT', NULL, 'PENDING', '2026-05-13 11:20:00', NULL),
('FEST-2026-0005', 3, 3, 6, 5, 0, 'CONFIRMED', 'WALLET', 'SUCCESS', '2026-05-14 09:00:00', '2026-05-14 09:01:00');

-- Insert sample wallet records
INSERT INTO wallets (user_id, balance, currency) VALUES
(1, 500.00, 'INR'),
(2, 1200.00, 'INR'),
(3, 750.50, 'INR'),
(4, 5000.00, 'INR');

-- Insert sample transactions
INSERT INTO transactions (user_id, booking_id, booking_reference, transaction_type, amount, payment_method, status) VALUES
(1, 1, 'FEST-2026-0001', 'PAYMENT', 998, 'CARD', 'SUCCESS'),
(1, 2, 'FEST-2026-0002', 'PAYMENT', 199, 'UPI', 'SUCCESS'),
(2, 3, 'FEST-2026-0003', 'PAYMENT', 999, 'NETBANKING', 'SUCCESS'),
(3, 5, 'FEST-2026-0005', 'PAYMENT', 0, 'WALLET', 'SUCCESS'),
(1, NULL, NULL, 'WALLET_CREDIT', 500, 'CARD', 'SUCCESS');

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER $$

-- Procedure to create a booking
CREATE PROCEDURE sp_create_booking(
    IN p_user_id BIGINT,
    IN p_event_id BIGINT,
    IN p_tier_id BIGINT,
    IN p_num_tickets INT,
    OUT p_booking_reference VARCHAR(20),
    OUT p_success BOOLEAN
)
BEGIN
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_booking_id BIGINT;
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_available_seats INT;
    
    START TRANSACTION;
    
    -- Get price tier details
    SELECT price, available_seats INTO v_price, v_available_seats 
    FROM price_tiers WHERE id = p_tier_id;
    
    -- Check availability
    IF v_available_seats >= p_num_tickets THEN
        SET v_total_amount = v_price * p_num_tickets;
        
        -- Insert booking
        INSERT INTO bookings (
            booking_reference, user_id, event_id, price_tier_id, 
            num_tickets, total_amount, booking_status, booked_at
        ) VALUES (
            CONCAT('FEST-', YEAR(NOW()), '-', LPAD(LAST_INSERT_ID() + 1, 4, '0')),
            p_user_id, p_event_id, p_tier_id, p_num_tickets, v_total_amount, 'PENDING_PAYMENT', NOW(6)
        );
        
        SET v_booking_id = LAST_INSERT_ID();
        SELECT booking_reference INTO p_booking_reference FROM bookings WHERE id = v_booking_id;
        
        -- Update available seats
        UPDATE price_tiers SET available_seats = available_seats - p_num_tickets 
        WHERE id = p_tier_id;
        
        SET p_success = TRUE;
        COMMIT;
    ELSE
        SET p_success = FALSE;
        ROLLBACK;
    END IF;
END$$

-- Procedure to confirm booking and process payment
CREATE PROCEDURE sp_confirm_booking(
    IN p_booking_id BIGINT,
    IN p_payment_method VARCHAR(50),
    IN p_transaction_id VARCHAR(100),
    OUT p_success BOOLEAN
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_wallet_balance DECIMAL(10,2);
    
    START TRANSACTION;
    
    -- Get booking details
    SELECT user_id, total_amount INTO v_user_id, v_total_amount 
    FROM bookings WHERE id = p_booking_id;
    
    -- Update booking status
    UPDATE bookings SET 
        booking_status = 'CONFIRMED',
        payment_status = 'SUCCESS',
        payment_method = p_payment_method,
        payment_transaction_id = p_transaction_id,
        confirmed_at = NOW(6)
    WHERE id = p_booking_id;
    
    -- Record transaction
    INSERT INTO transactions (
        user_id, booking_id, transaction_type, amount, payment_method, status
    ) VALUES (
        v_user_id, p_booking_id, 'PAYMENT', v_total_amount, p_payment_method, 'SUCCESS'
    );
    
    SET p_success = TRUE;
    COMMIT;
END$$

-- Procedure to cancel booking and refund
CREATE PROCEDURE sp_cancel_booking(
    IN p_booking_id BIGINT,
    OUT p_success BOOLEAN
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_tier_id BIGINT;
    DECLARE v_num_tickets INT;
    DECLARE v_total_amount DECIMAL(10,2);
    
    START TRANSACTION;
    
    -- Get booking details
    SELECT user_id, price_tier_id, num_tickets, total_amount 
    INTO v_user_id, v_tier_id, v_num_tickets, v_total_amount
    FROM bookings WHERE id = p_booking_id;
    
    -- Update booking status
    UPDATE bookings SET 
        booking_status = 'CANCELLED',
        payment_status = 'REFUNDED'
    WHERE id = p_booking_id;
    
    -- Restore seats
    UPDATE price_tiers SET 
        available_seats = available_seats + v_num_tickets
    WHERE id = v_tier_id;
    
    -- Record refund transaction
    INSERT INTO transactions (
        user_id, booking_id, transaction_type, amount, status
    ) VALUES (
        v_user_id, p_booking_id, 'REFUND', v_total_amount, 'SUCCESS'
    );
    
    SET p_success = TRUE;
    COMMIT;
END$$

DELIMITER ;

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

DELIMITER $$

-- Trigger to update event status based on bookings
CREATE TRIGGER tr_update_event_status_on_booking
AFTER UPDATE ON price_tiers
FOR EACH ROW
BEGIN
    DECLARE v_total_available INT;
    
    SELECT SUM(available_seats) INTO v_total_available 
    FROM price_tiers WHERE event_id = NEW.event_id;
    
    IF v_total_available = 0 THEN
        UPDATE events SET status = 'SOLD_OUT' WHERE id = NEW.event_id;
    END IF;
END$$

-- Trigger to update wallet last_transaction_at
CREATE TRIGGER tr_update_wallet_on_transaction
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    UPDATE wallets SET last_transaction_at = NOW() WHERE user_id = NEW.user_id;
END$$

-- Trigger to automatically create wallet for new user
CREATE TRIGGER tr_create_wallet_on_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO wallets (user_id, balance, currency) VALUES (NEW.id, 0.00, 'INR');
END$$

DELIMITER ;

-- =====================================================
-- Database Ready for Application Use
-- =====================================================
