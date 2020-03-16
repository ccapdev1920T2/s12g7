const index_controller = require('../controller/index.controller');

const express = require('express');
const router = express.Router();

router.get('/', index_controller.home);

router.get('/auth/google', index_controller.signin);

router.get('/auth/google/callback', index_controller.callback, index_controller.callback_success);

router.get('/register', index_controller.register);

router.get('/logout', index_controller.logout);


module.exports = router;