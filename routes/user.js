const user_controller = require('../controller/user');

const express = require('express');
const router = express.Router();

router.get('/auth/google', user_controller.signin);

router.get('/auth/google/callback', user_controller.callback, user_controller.callback_success);


module.exports = router;