const express = require('express');
const router = express.Router();
const path = require('path');

const equipmentController = require('../controller/equipment.controller');

const multer = require('multer');

const upload = multer({
    dest: path.join(__dirname, '../public/uploads/equipment-images/temp')
});

// create
router.post('/', upload.single('equipmentImage'), equipmentController.createEquipment);

// view all equipment
router.get('/', equipmentController.viewAllEquipment);

// update equipment
router.post('/update', upload.single('equipmentImage'), equipmentController.updateEquipment);

// delete equipment
router.post('/delete', equipmentController.deleteEquipment);

module.exports = router;
