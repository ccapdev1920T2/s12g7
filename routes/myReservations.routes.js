const myReservations_controller = require('../controller/myReservations.controller');

const express = require('express');
const router = express.Router();

router.get('/', myReservations_controller.myReservations);

module.exports = router;