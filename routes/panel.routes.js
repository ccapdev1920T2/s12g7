const express = require('express');
const router = express.Router();

const panel_controller = require('../controller/panel.controller');

router.post('/panel', panel_controller.panel_create);
router.get('', panel_controller.panel_details);
router.put('/panel/:panelid/locker/:lockernumber', panel_controller.panel_update);
router.delete('/panel/:panelid', panel_controller.panel_delete);

module.exports = router;
