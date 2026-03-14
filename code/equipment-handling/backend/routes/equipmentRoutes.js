import express from "express";
import { getAllEquipment, addEquipment, updateEquipment, deleteEquipment,addStock, removeStock } from "../controllers/equipmentController.js";

const router = express.Router();

router.get("/", getAllEquipment);
router.post("/", addEquipment);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);
router.patch("/:id/add-stock", addStock);
router.patch("/:id/remove-stock", removeStock);

export default router;