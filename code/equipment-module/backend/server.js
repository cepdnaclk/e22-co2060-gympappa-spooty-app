console.log("THIS IS THE CORRECT SERVER FILE ✅");

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

// ✅ GET MY ISSUED ITEMS
app.get('/my-items/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        const result = await pool.query(
            `SELECT 
                ie.issue_id,
                e.equipment_name,
                ie.quantity,
                ie.issue_time,
                ie.return_time,
                ie.status
             FROM issued_equipment ie
             JOIN equipment e 
             ON ie.equipment_id = e.equipment_id
             WHERE ie.user_id = $1
             ORDER BY ie.issue_time DESC`,
            [user_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ RETURN EQUIPMENT API
app.put('/return/:issue_id', async (req, res) => {
    console.log("Return API hit ✅");
    try {
        const { issue_id } = req.params;

        // 1️⃣ Find issue record
        const issueResult = await pool.query(
            'SELECT * FROM issued_equipment WHERE issue_id = $1',
            [issue_id]
        );

        if (issueResult.rows.length === 0) {
            return res.status(404).json({ message: "Issue record not found" });
        }

        const issue = issueResult.rows[0];

        // 2️⃣ Check if already returned
        if (issue.status === 'RETURNED') {
            return res.status(400).json({ message: "Equipment already returned" });
        }

        // 3️⃣ Increase equipment quantity
        await pool.query(
            'UPDATE equipment SET quantity = quantity + $1 WHERE equipment_id = $2',
            [issue.quantity, issue.equipment_id]
        );

        // 4️⃣ Update issued_equipment record
        const updatedResult = await pool.query(
            `UPDATE issued_equipment
             SET status = 'RETURNED',
                 return_time = CURRENT_TIMESTAMP
             WHERE issue_id = $1
             RETURNING *`,
            [issue_id]
        );

        res.json(updatedResult.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});