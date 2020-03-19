const express = require('express');
const router = express.Router();

const equipmentController = require('../controller/equipment.controller');

// create
router.post('/equipment', equipmentController.createEquipment);

//view all equipment
router.get('/equipment', equipmentController.viewAllEquipment);

// delete equipment
router.post('/equipment/delete', equipmentController.deleteEquipment);

module.exports = router;
