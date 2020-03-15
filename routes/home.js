const home_controller = require('../controller/home');

const express = require('express');
const router = express.Router();

router.get('/', home_controller.index);

module.exports = router;