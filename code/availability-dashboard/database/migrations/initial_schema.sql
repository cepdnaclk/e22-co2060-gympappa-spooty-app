CREATE TABLE sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    sport_id INT REFERENCES sports(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    total_quantity INT NOT NULL,
    remaining_quantity INT NOT NULL
);

CREATE TABLE issued_equipment (
    id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP
);