const reserve_controller = require('../controller/reserve.controller');

const express = require('express');
const router = express.Router();

router.get('/locker', reserve_controller.locker);
router.get('/equipment', reserve_controller.equipment);

module.exports = router;
