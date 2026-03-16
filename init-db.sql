CREATE DATABASE IF NOT EXISTS carbooking;
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
);

CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    car_type VARCHAR(100),
    color VARCHAR(50),
    manager VARCHAR(150),
    seats INT,
    fuel_type VARCHAR(50),
    act_expiry DATE,
    insurance_expiry DATE,
    description TEXT,
    status ENUM('available', 'maintenance', 'in_use') DEFAULT 'available',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    destination VARCHAR(255) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Insert a default admin user and test data
INSERT IGNORE INTO users (username, password, role, fullname, created_by)
VALUES 
('admin', 'admin', 'admin', 'System Admin', 'system'),
('user1', 'user1', 'user', 'Staff 1', 'system');

INSERT IGNORE INTO cars (brand, model, license_plate, car_type, color, manager, seats, fuel_type, act_expiry, insurance_expiry, description, created_by)
VALUES 
('Toyota', 'Commuter', 'นข 1234', 'รถตู้', 'บรอนซ์เงิน', 'นายสมชาย มั่นคง', 12, 'ดีเซล', '2025-06-30', '2025-06-30', 'รถตู้ส่วนกลางสำหรับรับส่งคณะทำงาน', 'admin'),
('Honda', 'CR-V', 'กท 5678', 'รถยนต์นั่งส่วนบุคคล', 'ดำ', 'นางสาวสมศรี ใจดี', 5, 'เบนซิน', '2025-12-15', '2025-12-15', 'รถประจำตำแหน่งผู้บริหาร', 'admin');
