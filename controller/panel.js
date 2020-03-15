const Panel = require('../model/panel');

exports.panel_create = function (req, res) {
    var locker_array = [];

    for (var i = req.body.lowRange; i <= req.body.highRange; i++) {
        locker_array.push({number: i, status: 'vacant'});
    }

    let panel = new Panel(
        {
            type: req.body.panelType,
            building: req.body.panelBldg,
            level: req.body.panelFloor,
            lockers: locker_array
        }
    );

    panel.save(function (err) {
        if (err) return next(err);
        res.send('Panel created successfully.')
    })
};

exports.panel_details = function(req, res) {
    Panel.find({building: bldg, level: flr}, function(err, panel) {
        if (err) return next(err);
        res.send(panel);
    })
};

exports.panel_update = function(req, res) {
    const targetPanel = await Panel.findOne({
        building: req.params.bldg, 
        level: req.params.flr, 
        panel: req.params.panelid
    });

    (targetPanel.lockers.find(obj => {return obj.number == lockernumber})).status = req.params.status;

    targetPanel.save(function(err) {
        if (err) return next(err);
        res.send('Locker status updated successfully.');
    });
};

exports.panel_delete = function(req, res) {
    Panel.findByIdAndRemove(req.params.panelid, function(err) {
        if (err) return next(err);
        res.send('Panel deleted successfully.')
    });
};


