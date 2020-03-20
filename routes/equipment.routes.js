const express = require('express');
const router = express.Router();
const path = require('path');

const equipmentController = require('../controller/equipment.controller');

const multer = require('multer');

const upload = multer({
    dest: path.join(__dirname, '../public/uploads/equipment-images/temp')
});

// create
router.post('/equipment', upload.single('equipmentImage'), equipmentController.createEquipment);

// view all equipment
router.get('/equipment', equipmentController.viewAllEquipment);

// update equipment
router.post('/equipment/update', equipmentController.updateEquipment);

// delete equipment
router.post('/equipment/delete', equipmentController.deleteEquipment);

module.exports = router;
