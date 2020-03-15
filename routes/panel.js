const express = require('express');
const router = express.Router();

const panel_controller = require('../controller/panel');

router.post('/create', panel_controller.panel_create);
router.get('/building/:bldg/floor/:flr', panel_controller.panel_details);
router.put('/building/:bldg/floor/:flr/panel/:panelid/locker/:lockernumber', panel_controller.panel_update);
router.delete('/building/:bldg/floor/:flr/panel/:panelid', panel_controller.panel_delete);

module.exports = router;