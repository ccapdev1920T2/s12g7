const user_controller = require('../controller/user.controller');

const express = require('express');
const router = express.Router();

router.get('/manage', user_controller.people_details);

router.get('/:idNum', user_controller.profile_details);
router.post('/:idNum', user_controller.profile_update);

module.exports = router;