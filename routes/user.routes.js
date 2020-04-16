const user_controller = require('../controller/user.controller');
const UserAuth = require('../user-middleware');

const express = require('express');
const router = express.Router();

const validation = require('../helpers/validation');

router.get('/manage', UserAuth.userIsAdmin, user_controller.people_details);
router.post('/manage', UserAuth.userIsAdmin, user_controller.people_update);
router.post('/manage/promote', UserAuth.userIsAdmin, user_controller.people_promote);
router.post('/manage/demote', UserAuth.userIsAdmin, user_controller.people_demote);
router.get('/manage/get-people', UserAuth.userIsAdmin, user_controller.people_get);

router.get('/', user_controller.profile_details);
router.post('/', validation.editProfileValidation(), user_controller.profile_update);

module.exports = router;