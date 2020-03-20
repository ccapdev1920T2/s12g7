const express = require('express');
const router = express.Router();

const panel_controller = require('../controller/panel.controller');

router.post('/', panel_controller.panel_create);
router.get('/', panel_controller.panel_details);
router.post('/update', panel_controller.panel_update);
router.post('/delete', panel_controller.panel_delete);

module.exports = router
