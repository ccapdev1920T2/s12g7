const user_controller = require('../controller/user.controller');

const express = require('express');
const router = express.Router();

router.get('/', user_controller.viewProfile);

module.exports = router;