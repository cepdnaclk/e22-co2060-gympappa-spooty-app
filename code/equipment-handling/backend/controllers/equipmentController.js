import pool from "../config/db.js";

export const getAllEquipment = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching equipment" });
  }
};

export const addEquipment = async (req, res) => {
  const { name, category, total_quantity, available_quantity } = req.body;

  if (available_quantity > total_quantity) {
    return res.status(400).json({
      message: "Available quantity cannot exceed total quantity"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO equipment (name, category, total_quantity, available_quantity)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, category, total_quantity, available_quantity]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding equipment" });
  }
};

export const updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, category, total_quantity, available_quantity } = req.body;

  if (available_quantity > total_quantity) {
    return res.status(400).json({
      message: "Available quantity cannot exceed total quantity"
    });
  }

  try {
    const result = await pool.query(
      `UPDATE equipment
       SET name=$1, category=$2, total_quantity=$3, available_quantity=$4
       WHERE equipment_id=$5
       RETURNING *`,
      [name, category, total_quantity, available_quantity, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating equipment" });
  }
};

export const deleteEquipment = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM equipment WHERE equipment_id=$1",
      [id]
    );

    res.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting equipment" });
  }
};