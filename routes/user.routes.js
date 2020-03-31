const user_controller = require('../controller/user.controller');
const UserAuth = require('../user-middleware');

const express = require('express');
const router = express.Router();

router.get('/manage', UserAuth.userIsAdmin, user_controller.people_details);
router.post('/manage', UserAuth.userIsAdmin, user_controller.people_update);
router.get('/manage/get-people', UserAuth.userIsAdmin, user_controller.people_get);

router.get('/:idNum', user_controller.profile_details);
router.post('/:idNum', user_controller.profile_update);

module.exports = router;