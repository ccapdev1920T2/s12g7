const reservations_controller = require('../controller/reservations.controller');
const UserAuth = require('../user-middleware');

const express = require('express');
const router = express.Router();

router.get('/', reservations_controller.myReservations);

router.get('/manage', UserAuth.userIsAdmin, reservations_controller.reservation_details);
router.get('/manage/uncleared', UserAuth.userIsAdmin, reservations_controller.uncleared_get);
router.get('/manage/get-reservations', UserAuth.userIsAdmin, reservations_controller.reservations_get);

router.post('/manage/update', UserAuth.userIsAdmin, reservations_controller.reservation_update);
router.post('/manage/delete', UserAuth.userIsAdmin, reservations_controller.reservation_delete);

module.exports = router;