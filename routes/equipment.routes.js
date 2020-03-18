const express = require('express');
const router = express.Router();

const equipmentController = require('../controller/equipment.controller');

// create
router.post('/equipment', equipmentController.createEquipment);

// read TODO:retrieve single or all?
/* router.get('/equipment', equipmentController.viewEquipment);

//update or replace TODO:
router.put('/equipment/:id', equipmentController.updateEquipment);

// delete TODO:
router.delete('/equipment/:equipmentid', equipmentController .deleteEquipment);

module.exports = router;
 */
