const user_controller = require('../controller/user.controller');

const express = require('express');
const router = express.Router();

router.get('/', user_controller.profile_details);
router.post('/', user_controller.profile_update);

module.exports = router;