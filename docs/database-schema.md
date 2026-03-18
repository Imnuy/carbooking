# Car Booking Database Schema

## ตาราง Master Tables (ตารางหลัก)

### 1. users (ผู้ใช้งาน)

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    fullname VARCHAR(150),
    department VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 2. cars (รถยนต์)

```sql
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    seats INTEGER,
    car_type VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 3. driver_type (ประเภทพนักงานขับรถ)

```sql
CREATE TABLE IF NOT EXISTS driver_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) UNIQUE NOT NULL,
    driver_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 4. drivers (พนักงานขับรถ)

```sql
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    driver_type_code VARCHAR(2) NOT NULL DEFAULT '01' REFERENCES driver_type(code),
    is_active BOOLEAN DEFAULT true,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 5. booking_status (สถานะการจอง)

```sql
CREATE TABLE IF NOT EXISTS booking_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 6. department (แผนก)

```sql
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 7. trip_type (ประเภททริป)

```sql
CREATE TABLE IF NOT EXISTS trip_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 8. fuel_reimbursement (ค่าน้ำมัน)

```sql
CREATE TABLE IF NOT EXISTS fuel_reimbursement (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### 9. trips (ทริป)

```sql
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id),
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

## ตาราง Transaction Tables (ตารางธุรกรรม)

### 1. bookings (การจองรถ)

```sql
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    requester_name VARCHAR(255),
    requester_position VARCHAR(255),
    car_id INTEGER,
    driver_name VARCHAR(150),
    supervisor_name VARCHAR(255),
    supervisor_position VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    destination VARCHAR(255) NOT NULL,
    purpose TEXT,
    fuel_reimbursement VARCHAR(100),
    distance DECIMAL(10,2),
    passengers INTEGER,
    trip_type VARCHAR(20) DEFAULT 'internal' CHECK (trip_type IN ('internal', 'external')),
    status_code VARCHAR(3) DEFAULT '001' CHECK (status_code IN ('001', '002', '003', '004', '005')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    -- Additional fields from production DB
    trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES department(id),
    trip_type_id INTEGER REFERENCES trip_type(id),
    fuel_reimbursement_id INTEGER REFERENCES fuel_reimbursement(id),
    status_id INTEGER REFERENCES booking_status(id)
);
```

## ความสัมพันธ์ระหว่างตาราง (Relationships)

```
users (1) ←→ (N) bookings  [NO CASCADE DELETE]
cars (1) ←→ (N) bookings   [NO CASCADE DELETE]  
driver_type (1) ←→ (N) drivers
booking_status (1) ←→ (N) bookings
trips (1) ←→ (N) bookings
department (1) ←→ (N) bookings
trip_type (1) ←→ (N) bookings
fuel_reimbursement (1) ←→ (N) bookings
drivers (1) ←→ (N) bookings
```

## ตารางที่มี Cascade Delete

### **drivers → bookings**

- เมื่อลบข้อมูลในตาราง `drivers`
- ข้อมูลการจองที่เกี่ยวข้องใน `bookings` จะถูก set null ที่ `driver_id`
- เนื่องจาก: `driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL`

### **trips → bookings**

- เมื่อลบข้อมูลในตาราง `trips`
- ข้อมูลการจองที่เกี่ยวข้องใน `bookings` จะถูก set null ที่ `trip_id`
- เนื่องจาก: `trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL`

## ตารางที่ไม่มี Cascade Delete

- `users` → `bookings` (ไม่มี foreign key constraint)
- `cars` → `bookings` (ไม่มี foreign key constraint)
- `driver_type` → `drivers` (มี constraint แต่ไม่มี cascade delete)
- `booking_status` → `bookings` (มี constraint แต่ไม่มี cascade delete)
- `department` → `bookings` (มี constraint แต่ไม่มี cascade delete)
- `trip_type` → `bookings` (มี constraint แต่ไม่มี cascade delete)
- `fuel_reimbursement` → `bookings` (มี constraint แต่ไม่มี cascade delete)

## สรุป

- **ลบ user** → **ไม่มีผล** ต่อ bookings (ไม่มี FK constraint)
- **ลบ car** → **ไม่มีผล** ต่อ bookings (ไม่มี FK constraint)
- **ลบ driver** → **bookings.driver_id = NULL**
- **ลบ trip** → **bookings.trip_id = NULL**
- **ลบ master tables อื่นๆ** → **ไม่มีผล** ต่อ bookings (มี FK แต่ไม่ cascade delete)

**คำเตือน:** การลบข้อมูลในตาราง `drivers` หรือ `trips` จะส่งผลให้ `bookings` ที่เกี่ยวข้องมีค่า NULL ในฟิลด์ที่อ้างอิง ควรใช้ความระมัดระวังในการลบข้อมูล

## ข้อมูลเริ่มต้น (Initial Data)

### ประเภทพนักงานขับรถ

```sql
INSERT INTO driver_type (code, driver_type, created_by, updated_by)
VALUES 
    ('01', 'พนักงานขับรถเป็นครั้งคราว', 'system', 'system'),
    ('02', 'พนักงานขับรถยนต์', 'system', 'system')
ON CONFLICT (code) DO UPDATE SET driver_type = EXCLUDED.driver_type;
```

### สถานะการจอง

```sql
INSERT INTO booking_status (code, status, description, created_by, updated_by)
VALUES 
    ('001', 'รออนุมัติ', 'คำขอการจองรถยังไม่ได้รับการอนุมัติ', 'system', 'system'),
    ('002', 'อนุมัติ', 'การจองรถได้รับการอนุมัติแล้ว', 'system', 'system'),
    ('003', 'ปฏิเสธ', 'การจองรถถูกปฏิเสธ', 'system', 'system'),
    ('004', 'เสร็จสิ้น', 'การจองรถเสร็จสิ้นแล้ว', 'system', 'system'),
    ('005', 'ยกเลิก', 'การจองรถถูกยกเลิก', 'system', 'system')
ON CONFLICT (code) DO UPDATE SET 
    status = EXCLUDED.status, 
    description = EXCLUDED.description;
```

## Indexes สำหรับประสิทธิภาพ

```sql
-- Indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status_code ON bookings(status_code);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

-- Indexes for cars table
CREATE INDEX IF NOT EXISTS idx_cars_license_plate ON cars(license_plate);
CREATE INDEX IF NOT EXISTS idx_cars_is_active ON cars(is_active);

-- Indexes for drivers table
CREATE INDEX IF NOT EXISTS idx_drivers_is_active ON drivers(is_active);
CREATE INDEX IF NOT EXISTS idx_drivers_type_code ON drivers(driver_type_code);

-- Indexes for status tables
CREATE INDEX IF NOT EXISTS idx_booking_status_code ON booking_status(code);
```

## Trigger สำหรับอัพเดท timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_status_updated_at BEFORE UPDATE ON booking_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_type_updated_at BEFORE UPDATE ON driver_type FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## การใช้งานผ่าน Docker

### ตรวจสอบตารางทั้งหมด

```powershell
docker exec -i postgres psql -U admin -d carbooking -c "\dt"
```

### ตรวจสอบข้อมูลในตาราง master

```powershell
# ตรวจสอบข้อมูลผู้ใช้
docker exec -i postgres psql -U admin -d carbooking -c "SELECT id, username, fullname, role FROM users ORDER BY id;"

# ตรวจสอบข้อมูลรถ
docker exec -i postgres psql -U admin -d carbooking -c "SELECT id, brand, model, license_plate, is_active FROM cars ORDER BY id;"

# ตรวจสอบประเภทพนักงานขับรถ
docker exec -i postgres psql -U admin -d carbooking -c "SELECT id, code, driver_type FROM driver_type ORDER BY code;"

# ตรวจสอบพนักงานขับรถ
docker exec -i postgres psql -U admin -d carbooking -c "SELECT id, fullname, driver_type_code, is_active FROM drivers ORDER BY id;"

# ตรวจสอบสถานะการจอง
docker exec -i postgres psql -U admin -d carbooking -c "SELECT id, code, status FROM booking_status ORDER BY code;"
```

### ตรวจสอบข้อมูลในตาราง transaction

```powershell
# ตรวจสอบการจองทั้งหมด
docker exec -i postgres psql -U admin -d carbooking -c "SELECT id, user_id, car_id, status_code, start_time, destination FROM bookings ORDER BY created_at DESC LIMIT 10;"
```

## บันทึกการเปลี่ยนแปลง (Change Log)

- **Version 1.0** (2025-01-01): สร้างตารางหลักและตารางธุรกรรมเบื้องต้น
  - Master Tables: users, cars, driver_type, drivers, booking_status
  - Transaction Tables: bookings
  - เพิ่ม indexes และ triggers สำหรับประสิทธิภาพ

- **Version 1.1** (2025-03-18): อัพเดทโครงสร้างให้ตรงกับ production database
  - เพิ่ม Master Tables: department, trip_type, fuel_reimbursement, trips
  - อัพเดท bookings table: เพิ่มฟิลด์ trip_id, driver_id, department_id, trip_type_id, fuel_reimbursement_id, status_id
  - **เปลี่ยนแปลงสำคัญ**: ลบ foreign key constraint ระหว่าง users→bookings และ cars→bookings
  - คงไว้เฉพาะ ON DELETE SET NULL สำหรับ drivers→bookings และ trips→bookings
