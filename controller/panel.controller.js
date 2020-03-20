const Panel = require('../model/panel.model');

exports.panel_create = async function (req, res) {
   
    var locker_array =[];

    for (var i = parseInt(req.body.lowerRange); i <= parseInt(req.body.upperRange); i++) {
        locker_array.push({number: i, status: 'vacant'});
    }
    
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

    try {
        await panel.save();
    }
    catch (err) {
        console.log('Error writing to db: ' + err);
    }
    res.redirect("/manage-lockers/?bldg=" + req.body.building + "&flr=" + req.body.level);
};

exports.panel_details = async function(req, res) {
    // Show the panels
    if (req.query.bldg != null && req.query.flr != null) {
        try {
            var panel = await Panel.find({building: req.query.bldg, level: req.query.flr});
            var panel_floor = await Panel.find({building: req.query.bldg}).distinct('level');
            var panel_building = await Panel.find().distinct('building');

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
        } 
        catch (err) {
            console.log(err);
        }
    }
    else if (req.query.bldg != null) {
        try {
            var panel_floor = await Panel.find({building: req.query.bldg}).distinct('level');
            if (panel_floor[0] != null) {
                panel_floor = panel_floor.sort();
                res.redirect("/manage-lockers/?bldg=" + req.query.bldg + "&flr=" + panel_floor[0]);
            }
            else {
                res.redirect("/manage-lockers/");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        try {
            var panel_building = await Panel.find().distinct('building');
            if (panel_building[0] != null) {
                try {
                    var panel_floor = await Panel.find({building: panel_building[0]}).distinct('level');
                    panel_floor = panel_floor.sort();
                    res.redirect("/manage-lockers/?bldg=" + panel_building[0] + "&flr=" + panel_floor[0]);
                }
                catch (err) {
                    console.log(err);
                }
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
        }
        catch (err) {
            console.log(err);
        }
    }
};

exports.panel_update = async function(req, res) {
    try {
        var panel = await Panel.findById(req.body.panelid);
        if (panel) {
            for (var i = 0; i < panel.upperRange - panel.lowerRange + 1; i++) {
                if (panel.lockers[i].number == parseInt(req.body.lockernumber)) {
                    panel.lockers[i].status = req.body.status;
                }
            };
            try {
                await panel.save();
            } 
            catch (err) {
                console.log('Error updating db: ' + err);
            }
        } 
        else {
            console.log('Panel cannot be accessed');
        }
    } catch (err) {
        console.log(err);
    }
    res.redirect("/manage-lockers/?bldg=" + req.body.building + "&flr=" + req.body.level);
};

exports.panel_delete = async function(req, res) {
    try {
        await Panel.findByIdAndDelete(req.body.panelid);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect("/manage-lockers/?bldg=" + req.body.building + "&flr=" + req.body.level);
};
