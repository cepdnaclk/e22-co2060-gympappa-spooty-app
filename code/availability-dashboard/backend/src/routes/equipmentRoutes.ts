import express from 'express';
import { 
    getAllEquipment, 
    issueEquipment, 
    updateEquipmentQuantity 
} from '../controllers/equipmentController';

const router = express.Router();

// Route to get all equipment
router.get('/', getAllEquipment);             // GET /api/equipment

// Route to issue equipment
router.post('/issue', issueEquipment);        // POST /api/equipment/issue

// Route to update equipment quantity
router.put('/:id', updateEquipmentQuantity);  // PUT /api/equipment/:id

export default router;
