const reservations_controller = require('../controller/reservations.controller');

const express = require('express');
const router = express.Router();

router.get('/', reservations_controller.myReservations);

router.get('/manage', reservations_controller.manageReservations);


module.exports = router;