import { Request, Response } from 'express';
import Equipment from '../models/Equipment';

// Fetch all equipment
export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const equipmentList = await Equipment.findAll();

    // Format the response so frontend gets exactly what it expects
    const formattedEquipment = equipmentList.map((eq: any) => ({
      id: eq.id,
      sport_id: eq.sport_id,
      name: eq.name,
      total_quantity: eq.total_quantity,
      remaining_quantity: eq.remaining_quantity,
    }));

    res.status(200).json(formattedEquipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching equipment' });
  }
};

// Issue equipment
export const issueEquipment = async (req: Request, res: Response) => {
  const { equipmentId, quantity } = req.body;

  try {
    const equipment: any = await Equipment.findByPk(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.remaining_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient equipment available' });
    }

    equipment.remaining_quantity -= quantity;
    await equipment.save();

    res.status(200).json({
      message: 'Equipment issued successfully',
      remaining_quantity: equipment.remaining_quantity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error issuing equipment' });
  }
};

// Update equipment quantity
export const updateEquipmentQuantity = async (req: Request, res: Response) => {
  const { equipmentId, quantity } = req.body;

  try {
    const equipment: any = await Equipment.findByPk(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    equipment.total_quantity += quantity;
    equipment.remaining_quantity += quantity;

    await equipment.save();

    res.status(200).json({
      message: 'Equipment quantity updated successfully',
      total_quantity: equipment.total_quantity,
      remaining_quantity: equipment.remaining_quantity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating equipment quantity' });
  }
};
