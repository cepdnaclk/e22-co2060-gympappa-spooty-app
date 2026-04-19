-- ============================================================
-- VERIFICATION & FIX: Ensure correct schema structure
-- ============================================================

-- Step 1: Verify/Create sports table
CREATE TABLE IF NOT EXISTS sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Step 2: Verify/Create equipment table (generic equipment types)
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Step 3: Verify/Create sport_equipment table (junction table)
CREATE TABLE IF NOT EXISTS sport_equipment (
    id SERIAL PRIMARY KEY,
    sport_id INT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    total_quantity INT NOT NULL DEFAULT 0,
    remaining_quantity INT NOT NULL DEFAULT 0,
    UNIQUE(sport_id, equipment_id)
);

-- Step 4: Ensure requested_equipment table exists with correct structure
CREATE TABLE IF NOT EXISTS requested_equipment (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    equipment_id INT NOT NULL REFERENCES sport_equipment(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    pickup_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'issued',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Ensure issued_equipment table exists with correct structure
CREATE TABLE IF NOT EXISTS issued_equipment (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50),
    equipment_id INT,
    quantity INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'issued',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Insert sports (ignore duplicates)
INSERT INTO sports (name) VALUES
    ('Badminton'),
    ('Baseball'),
    ('Basketball'),
    ('Chess'),
    ('Cricket'),
    ('Elle'),
    ('Football'),
    ('Hockey'),
    ('Rugby'),
    ('Table Tennis'),
    ('Tennis'),
    ('Track and Field'),
    ('Volleyball')
ON CONFLICT (name) DO NOTHING;

-- Step 7: Insert generic equipment types (ignore duplicates)
INSERT INTO equipment (name) VALUES
    ('Bat'),
    ('Ball'),
    ('Racket'),
    ('Shuttlecock'),
    ('Gloves'),
    ('Shoes'),
    ('Uniform'),
    ('Pad'),
    ('Helmet')
ON CONFLICT (name) DO NOTHING;

-- Step 8: Insert sport_equipment mappings (sport -> equipment with display name)
INSERT INTO sport_equipment (sport_id, equipment_id, display_name, total_quantity, remaining_quantity)
VALUES
    -- Cricket
    ((SELECT id FROM sports WHERE name = 'Cricket'), (SELECT id FROM equipment WHERE name = 'Bat'), 'Cricket Bat', 6, 6),
    ((SELECT id FROM sports WHERE name = 'Cricket'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Cricket Ball', 10, 10),
    
    -- Baseball
    ((SELECT id FROM sports WHERE name = 'Baseball'), (SELECT id FROM equipment WHERE name = 'Bat'), 'Baseball Bat', 6, 6),
    ((SELECT id FROM sports WHERE name = 'Baseball'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Baseball', 10, 10),
    
    -- Basketball
    ((SELECT id FROM sports WHERE name = 'Basketball'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Basketball', 6, 6),
    
    -- Tennis
    ((SELECT id FROM sports WHERE name = 'Tennis'), (SELECT id FROM equipment WHERE name = 'Racket'), 'Tennis Racket', 8, 8),
    ((SELECT id FROM sports WHERE name = 'Tennis'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Tennis Ball', 20, 20),
    
    -- Table Tennis
    ((SELECT id FROM sports WHERE name = 'Table Tennis'), (SELECT id FROM equipment WHERE name = 'Racket'), 'Table Tennis Racket', 10, 10),
    ((SELECT id FROM sports WHERE name = 'Table Tennis'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Table Tennis Ball', 20, 20),
    
    -- Badminton
    ((SELECT id FROM sports WHERE name = 'Badminton'), (SELECT id FROM equipment WHERE name = 'Racket'), 'Badminton Racket', 10, 10),
    ((SELECT id FROM sports WHERE name = 'Badminton'), (SELECT id FROM equipment WHERE name = 'Shuttlecock'), 'Shuttlecock', 20, 20),
    
    -- Volleyball
    ((SELECT id FROM sports WHERE name = 'Volleyball'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Volleyball', 6, 6),
    
    -- Football
    ((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Football', 6, 6),
    
    -- Rugby
    ((SELECT id FROM sports WHERE name = 'Rugby'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Rugby Ball', 4, 4),
    
    -- Hockey
    ((SELECT id FROM sports WHERE name = 'Hockey'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Hockey Ball', 10, 10),
    
    -- Elle
    ((SELECT id FROM sports WHERE name = 'Elle'), (SELECT id FROM equipment WHERE name = 'Ball'), 'Elle Ball', 6, 6),
    
    -- Chess
    ((SELECT id FROM sports WHERE name = 'Chess'), (SELECT id FROM equipment WHERE name = 'Pad'), 'Chess Board', 5, 5)
ON CONFLICT (sport_id, equipment_id) DO UPDATE
SET display_name = EXCLUDED.display_name,
    total_quantity = EXCLUDED.total_quantity,
    remaining_quantity = EXCLUDED.remaining_quantity;

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sport_equipment_sport_id ON sport_equipment(sport_id);
CREATE INDEX IF NOT EXISTS idx_sport_equipment_equipment_id ON sport_equipment(equipment_id);
CREATE INDEX IF NOT EXISTS idx_requested_equipment_student_id ON requested_equipment(student_id);
CREATE INDEX IF NOT EXISTS idx_requested_equipment_status ON requested_equipment(status);
CREATE INDEX IF NOT EXISTS idx_requested_equipment_equipment_id ON requested_equipment(equipment_id);

-- Step 10: Verify schema
SELECT 'sports' as table_name, COUNT(*) as row_count FROM sports
UNION ALL
SELECT 'equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'sport_equipment', COUNT(*) FROM sport_equipment
UNION ALL
SELECT 'requested_equipment', COUNT(*) FROM requested_equipment;
