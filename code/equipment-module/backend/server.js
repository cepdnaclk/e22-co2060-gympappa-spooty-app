const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Test Route
app.get('/', (req, res) => {
    res.send("GympAPPa Equipment Backend is Running ✅");
});


// ✅ ISSUE EQUIPMENT API
app.post('/issue', async (req, res) => {
    try {
        const { user_id, equipment_id, quantity } = req.body;

        // 1️⃣ Check if equipment exists
        const equipmentResult = await pool.query(
            'SELECT * FROM equipment WHERE equipment_id = $1',
            [equipment_id]
        );

        if (equipmentResult.rows.length === 0) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        const equipment = equipmentResult.rows[0];

        // 2️⃣ Check if enough quantity available
        if (equipment.quantity < quantity) {
            return res.status(400).json({ message: "Not enough equipment available" });
        }

        // 3️⃣ Reduce equipment quantity
        await pool.query(
            'UPDATE equipment SET quantity = quantity - $1 WHERE equipment_id = $2',
            [quantity, equipment_id]
        );

        // 4️⃣ Insert into issued_equipment table
        const issueResult = await pool.query(
            `INSERT INTO issued_equipment 
            (user_id, equipment_id, quantity) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
            [user_id, equipment_id, quantity]
        );

        res.status(201).json(issueResult.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});