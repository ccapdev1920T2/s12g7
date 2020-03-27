const reservations_controller = require('../controller/reservations.controller');

const express = require('express');
const router = express.Router();

router.get('/', reservations_controller.myReservations);

router.get('/manage', reservations_controller.reservation_details);
// router.post('/manage', reservations_controller.reservation_create);

router.post('/manage/update', reservations_controller.reservation_update);
router.post('/manage/delete', reservations_controller.reservation_delete);

module.exports = router;