-- Drop tables if they exist
DROP TABLE IF EXISTS issued_equipment;
DROP TABLE IF EXISTS equipment;

-- Equipment table
CREATE TABLE equipment (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL
);

-- Sample data
INSERT INTO equipment (equipment_name, quantity)
VALUES 
('Football', 10),
('Basketball', 8),
('Badminton Racket', 15),
('Volleyball', 6);

-- Issued equipment table
CREATE TABLE issued_equipment (
    issue_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    issue_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ISSUED',

    FOREIGN KEY (equipment_id)
        REFERENCES equipment(equipment_id)
);