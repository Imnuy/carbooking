-- ============================================================
-- MASTER TABLE MIGRATION: normalize to id, name, is_active only
-- ============================================================

-- ============================================================
-- STEP 1: Drop legacy NOT NULL constraints on master tables
-- so we can safely insert/migrate without providing old columns
-- ============================================================

-- booking_status: drop code NOT NULL, drop extra audit cols
ALTER TABLE booking_status ALTER COLUMN code DROP NOT NULL;
ALTER TABLE booking_status DROP COLUMN IF EXISTS code;
ALTER TABLE booking_status DROP COLUMN IF EXISTS description;
ALTER TABLE booking_status DROP COLUMN IF EXISTS created_at;
ALTER TABLE booking_status DROP COLUMN IF EXISTS created_by;
ALTER TABLE booking_status DROP COLUMN IF EXISTS updated_at;
ALTER TABLE booking_status DROP COLUMN IF EXISTS updated_by;
ALTER TABLE booking_status ALTER COLUMN status DROP NOT NULL;

-- car_type
ALTER TABLE car_type ALTER COLUMN car_type DROP NOT NULL;

-- driver_type
ALTER TABLE driver_type ALTER COLUMN code DROP NOT NULL;
ALTER TABLE driver_type ALTER COLUMN driver_type DROP NOT NULL;

-- department
ALTER TABLE department ALTER COLUMN department_name DROP NOT NULL;

-- trip_type
ALTER TABLE trip_type ALTER COLUMN code DROP NOT NULL;
ALTER TABLE trip_type ALTER COLUMN trip_type_name DROP NOT NULL;

-- fuel_reimbursement
ALTER TABLE fuel_reimbursement ALTER COLUMN code DROP NOT NULL;
ALTER TABLE fuel_reimbursement ALTER COLUMN fuel_reimbursement_name DROP NOT NULL;

-- user_role
ALTER TABLE user_role ALTER COLUMN code DROP NOT NULL;
ALTER TABLE user_role ALTER COLUMN role_name DROP NOT NULL;

-- ============================================================
-- STEP 2: Ensure name column is populated from old columns
-- ============================================================

UPDATE booking_status SET name = status WHERE name IS NULL AND status IS NOT NULL;
UPDATE car_type        SET name = car_type WHERE name IS NULL AND car_type IS NOT NULL;
UPDATE driver_type     SET name = driver_type WHERE name IS NULL AND driver_type IS NOT NULL;
UPDATE department      SET name = department_name WHERE name IS NULL AND department_name IS NOT NULL;
UPDATE trip_type       SET name = trip_type_name WHERE name IS NULL AND trip_type_name IS NOT NULL;
UPDATE fuel_reimbursement SET name = fuel_reimbursement_name WHERE name IS NULL AND fuel_reimbursement_name IS NOT NULL;
UPDATE user_role       SET name = role_name WHERE name IS NULL AND role_name IS NOT NULL;

-- ============================================================
-- STEP 3: Add FK _id columns to bookings, drivers, users, cars
-- ============================================================

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS department_id       INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS trip_type_id        INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS fuel_reimbursement_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status_id           INTEGER;
ALTER TABLE drivers  ADD COLUMN IF NOT EXISTS driver_type_id      INTEGER;
ALTER TABLE users    ADD COLUMN IF NOT EXISTS role_id             INTEGER;
ALTER TABLE cars     ADD COLUMN IF NOT EXISTS car_type_id         INTEGER;

-- ============================================================
-- STEP 4: Migrate data from old string columns to FK id columns
-- ============================================================

-- bookings.trip_type_id  (old col: trip_type = code or trip_type_name)
UPDATE bookings b
SET trip_type_id = tt.id
FROM trip_type tt
WHERE b.trip_type_id IS NULL
  AND b.trip_type IS NOT NULL
  AND (b.trip_type = tt.code OR b.trip_type = tt.trip_type_name OR b.trip_type = tt.name);

-- bookings.fuel_reimbursement_id  (old col: fuel_reimbursement = name)
UPDATE bookings b
SET fuel_reimbursement_id = fr.id
FROM fuel_reimbursement fr
WHERE b.fuel_reimbursement_id IS NULL
  AND b.fuel_reimbursement IS NOT NULL
  AND (b.fuel_reimbursement = fr.fuel_reimbursement_name OR b.fuel_reimbursement = fr.name);

-- bookings.status_id  (old col: status = code or status text)
UPDATE bookings b
SET status_id = bs.id
FROM booking_status bs
WHERE b.status_id IS NULL
  AND b.status IS NOT NULL
  AND (b.status = bs.code OR b.status = bs.status OR b.status = bs.name);

-- bookings.department_id  (old col: none in bookings — skip if already set)

-- drivers.driver_type_id  (old col: driver_type_code)
UPDATE drivers d
SET driver_type_id = dt.id
FROM driver_type dt
WHERE d.driver_type_id IS NULL
  AND d.driver_type_code IS NOT NULL
  AND (d.driver_type_code = dt.code OR d.driver_type_code = dt.driver_type OR d.driver_type_code = dt.name);

-- users.role_id  (old col: role)
UPDATE users u
SET role_id = ur.id
FROM user_role ur
WHERE u.role_id IS NULL
  AND u.role IS NOT NULL
  AND (u.role = ur.code OR u.role = ur.role_name OR u.role = ur.name);

-- cars.car_type_id  (old col: car_type)
UPDATE cars c
SET car_type_id = ct.id
FROM car_type ct
WHERE c.car_type_id IS NULL
  AND c.car_type IS NOT NULL
  AND (c.car_type = ct.car_type OR c.car_type = ct.name);

-- ============================================================
-- STEP 5: Drop legacy old string columns from transaction tables
-- ============================================================

ALTER TABLE bookings DROP COLUMN IF EXISTS trip_type;
ALTER TABLE bookings DROP COLUMN IF EXISTS fuel_reimbursement;
ALTER TABLE bookings DROP COLUMN IF EXISTS status;
ALTER TABLE drivers  DROP COLUMN IF EXISTS driver_type_code;
ALTER TABLE users    DROP COLUMN IF EXISTS role;

-- ============================================================
-- STEP 6: Drop legacy old columns from master tables
-- ============================================================

ALTER TABLE booking_status     DROP COLUMN IF EXISTS status;
ALTER TABLE car_type           DROP COLUMN IF EXISTS car_type;
ALTER TABLE driver_type        DROP COLUMN IF EXISTS code;
ALTER TABLE driver_type        DROP COLUMN IF EXISTS driver_type;
ALTER TABLE department         DROP COLUMN IF EXISTS department_name;
ALTER TABLE trip_type          DROP COLUMN IF EXISTS code;
ALTER TABLE trip_type          DROP COLUMN IF EXISTS trip_type_name;
ALTER TABLE fuel_reimbursement DROP COLUMN IF EXISTS code;
ALTER TABLE fuel_reimbursement DROP COLUMN IF EXISTS fuel_reimbursement_name;
ALTER TABLE user_role          DROP COLUMN IF EXISTS code;
ALTER TABLE user_role          DROP COLUMN IF EXISTS role_name;

-- ============================================================
-- STEP 7: Add FK constraints (if not present)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_trip_type_id_fkey') THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_trip_type_id_fkey FOREIGN KEY (trip_type_id) REFERENCES trip_type(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_fuel_reimbursement_id_fkey') THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_fuel_reimbursement_id_fkey FOREIGN KEY (fuel_reimbursement_id) REFERENCES fuel_reimbursement(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_status_id_fkey') THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_status_id_fkey FOREIGN KEY (status_id) REFERENCES booking_status(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_department_id_fkey') THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_department_id_fkey FOREIGN KEY (department_id) REFERENCES department(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'drivers_driver_type_id_fkey') THEN
    ALTER TABLE drivers ADD CONSTRAINT drivers_driver_type_id_fkey FOREIGN KEY (driver_type_id) REFERENCES driver_type(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_role_id_fkey') THEN
    ALTER TABLE users ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES user_role(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cars_car_type_id_fkey') THEN
    ALTER TABLE cars ADD CONSTRAINT cars_car_type_id_fkey FOREIGN KEY (car_type_id) REFERENCES car_type(id);
  END IF;
END $$;

-- ============================================================
-- STEP 8: Verify final schema
-- ============================================================

SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('booking_status','car_type','driver_type','department','trip_type','fuel_reimbursement','user_role')
ORDER BY table_name, ordinal_position;

SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('bookings','cars','drivers','users')
ORDER BY table_name, ordinal_position;
