const express = require('express');
const router = express.Router();

const equipment_controller = require('../controller/equipment.controller');

// create
router.post('/equipment', equipment_controller.equipment_create);

// read
router.get('/equipment', equipment_controller.equipment_details);

//update or replace TODO:
router.put('', equipment_controller.equipment_update);

// delete TODO:
router.delete('', equipment_controller.equipment_delete);

module.exports = router;

