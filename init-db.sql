CREATE DATABASE IF NOT EXISTS carbooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carbooking;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    fullname VARCHAR(150),
    department VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    seats INT,
    car_type VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    requester_name VARCHAR(255),
    requester_position VARCHAR(255),
    car_id INT NULL,
    driver_name VARCHAR(150),
    supervisor_name VARCHAR(255),
    supervisor_position VARCHAR(255),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    destination VARCHAR(255) NOT NULL,
    purpose TEXT,
    fuel_reimbursement VARCHAR(100),
    distance DECIMAL(10,2),
    passengers TEXT,
    trip_type ENUM('internal', 'external') DEFAULT 'internal',
    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default admin user and test data
INSERT IGNORE INTO users (username, password, role, fullname, created_by)
VALUES 
('admin', 'admin', 'admin', 'System Admin', 'system'),
('user1', 'user1', 'user', 'Staff 1', 'system');

INSERT IGNORE INTO cars (brand, model, license_plate, seats, car_type, created_by)
VALUES 
('Toyota', 'Commuter', 'นข 1234', 12, 'รถตู้', 'admin'),
('Honda', 'CR-V', 'กท 5678', 5, 'รถกระบะ4ประตู', 'admin');

