const express = require('express');
const router = express.Router();
const UserAuth = require('../user-middleware');


const panel_controller = require('../controller/panel.controller');

router.post('/', UserAuth.userIsAdmin, panel_controller.panel_create);
router.get('/', UserAuth.userIsAdmin, panel_controller.panel_details);
router.post('/update', UserAuth.userIsAdmin, panel_controller.panel_update);
router.post('/delete', UserAuth.userIsAdmin, panel_controller.panel_delete);

module.exports = router
