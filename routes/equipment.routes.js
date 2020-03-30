const express = require('express');
const router = express.Router();
const path = require('path');
const UserAuth = require('../user-middleware');

const equipmentController = require('../controller/equipment.controller');

const multer = require('multer');

const upload = multer({
    dest: path.join(__dirname, '../public/uploads/equipment-images/temp')
});

// create
router.post('/', UserAuth.userIsAdmin, upload.single('equipmentImage'), equipmentController.createEquipment);

// view all equipment
router.get('/', UserAuth.userIsAdmin, equipmentController.viewAllEquipment);

// update equipment
router.post('/update', UserAuth.userIsAdmin, upload.single('equipmentImage'), equipmentController.updateEquipment);

// delete equipment
router.post('/delete', UserAuth.userIsAdmin, equipmentController.deleteEquipment);

module.exports = router;
