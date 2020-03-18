const Panel = require('../model/panel.model');

exports.panel_create = async function (req, res) {
   
    var locker_array =[];

    for (var i = parseInt(req.body.lowerRange); i <= parseInt(req.body.upperRange); i++) {
        locker_array.push({number: i, status: 'vacant'});
    }
    
    console.log(locker_array);

    let panel = new Panel({
            number: req.body.number,
            type: req.body.type,
            building: req.body.building,
            level: req.body.level,
            lockers: locker_array,
            lowerRange: req.body.lowerRange,
            upperRange: req.body.upperRange
        }
    );

    await panel.save(function (err) {
        if (err) {
            console.log('Error writing to db');
        } else {
            console.log('success');
            res.redirect("/manage-lockers/panel?bldg=" + req.body.building + "&flr=" + req.body.level);
        }
    });
};

exports.panel_details = function(req, res) {
    // Show the panels
    if (req.query.bldg != null && req.query.flr != null) {
        Panel.find({building: req.query.bldg, level: req.query.flr}, function(err, panel) {
            if (err) return next(err);
            
            Panel.find({building: req.query.bldg}).distinct('level', function(err, panel_floor) {
                if (err) return next(err);
    
                Panel.find().distinct('building', function(err, panel_building) {
                    if (err) return next(err);
                    res.render('manage-lockers-page', {
                        active: { active_manage_lockers: true },
                        sidebarData: { 
                            dp: req.session.passport.user.profile.photos[0].value,
                            name: req.session.passport.user.profile.displayName
                        },
                        panel_buildings: panel_building,
                        panel_floors: panel_floor.sort(),
                        panels: panel
                    });
                });
            });
        });
    }
    // Show list of floors in the building (and also list of buildings), auto-select floor
    else {
        Panel.find().distinct('building', function(err, panel_building) {
            if (err) return next(err);

            if (panel_building[0] != null) {
                Panel.find({building: panel_building[0]}).distinct('level', function(err, panel_floor) {
                    if (err) return next(err);
                    Panel.find().distinct('building', function(err, panel_building) {
                        if (err) return next(err);
                        panel_floor = panel_floor.sort();
                        res.redirect("/manage-lockers/panel?bldg=" + panel_building[0] + "&flr=" + panel_floor[0]);
                    });
                });
            }
            else {
                res.render('manage-lockers-page', {
                    active: { active_manage_lockers: true },
                    sidebarData: { 
                        dp: req.session.passport.user.profile.photos[0].value,
                        name: req.session.passport.user.profile.displayName
                    }
                });
            }
        });
    }
};

exports.panel_update = async function(req, res) {
    await Panel.findById(req.body.panelid, async function(err, panel) {
        if (err) return next(err);

        for (var i = 0; i < panel.upperRange - panel.lowerRange + 1; i++) {
            // console.log(targetPanel.lockers[i].number);
            // console.log(req.body.lockernumber);
            if (panel.lockers[i].number == parseInt(req.body.lockernumber)) {
                console.log(panel.lockers[i]);
                panel.lockers[i].status = req.body.status;
                console.log(panel.lockers[i]);
            }
        };
       
        await panel.save(function (err) {
            if (err) {
                console.log('Error updating db');
            } else {
                console.log('success');
                res.redirect("/manage-lockers/panel?bldg=" + req.body.building + "&flr=" + req.body.level);
            }
        });

    });
};

exports.panel_delete = function(req, res) {
    Panel.findByIdAndRemove(req.params.panelid, function(err) {
        if (err) return next(err);
        res.send('Panel deleted successfully.')
    });
};
