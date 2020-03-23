const Panel = require('../model/panel.model');
const Locker = require('../model/locker.model');
const hbs = require('hbs');

hbs.registerHelper('lockernumber', function (str) { return JSON.parse(JSON.stringify(str)).number; });
hbs.registerHelper('lockerstatus', function (str) { return JSON.parse(JSON.stringify(str)).status; });
hbs.registerHelper('capitalizeFirst', function (text) { return text[0].toUpperCase() + text.slice(1); });

exports.panel_create = async function (req, res) {

    try {
        var panel_number = await Panel
            .find({ building: req.body.building, level: req.body.level, type: req.body.type })
            .distinct('number')
            .sort();

        var missingPanelNumber = 1;
        for (var i = 0; i < panel_number.length; i++) {
            if (missingPanelNumber != panel_number[i]) {
                break;
            }
            missingPanelNumber++;
        }

        var locker_array = [];
        for (var i = parseInt(req.body.lowerRange); i <= parseInt(req.body.upperRange); i++) {
            var locker = new Locker({ number: i, status: 'vacant' })
            await locker.save();
            locker_array.push(locker._id);
        }

        var panel = new Panel({
            number: missingPanelNumber,
            type: req.body.type,
            building: req.body.building,
            level: req.body.level,
            lockers: locker_array,
            lowerRange: req.body.lowerRange,
            upperRange: req.body.upperRange
        });

        await panel.save();
    }
    catch (err) {
        console.log(err);
    }

    res.redirect("/manage-lockers/?bldg=" + req.body.building + "&flr=" + req.body.level);
};

exports.panel_details = async function (req, res) {

    // Show the panels
    if (req.query.bldg != null && req.query.flr != null) {
        try {
            var panel = await Panel.find({ building: req.query.bldg, level: req.query.flr }).populate('lockers');
            var panel_floor = await Panel.find({ building: req.query.bldg }).distinct('level').populate('lockers');
            var panel_building = await Panel.find().distinct('building').populate('lockers');

            res.render('manage-lockers-page', {
                active: { active_manage_lockers: true },
                sidebarData: {
                    dp: req.session.passport.user.profile.photos[0].value,
                    name: req.session.passport.user.profile.displayName,
                    idNum: req.session.idNum
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
            var panel_floor = await Panel.find({ building: req.query.bldg }).distinct('level').populate();
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
            var panel_building = await Panel.find().distinct('building').populate();
            if (panel_building[0] != null) {
                try {
                    var panel_floor = await Panel.find({ building: panel_building[0] }).distinct('level');
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
                        name: req.session.passport.user.profile.displayName,
                        idNum: req.session.idNum
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};

exports.panel_update = async function (req, res) {
    try {
        var panel = await Panel.findById(req.body.panelid);
        if (panel) {
            var lockerIndex = req.body.lockernumber - panel.lowerRange;
            await Locker.findByIdAndUpdate(panel.lockers[lockerIndex]._id, { status: req.body.status });
            await panel.save();
        } else {
            console.log('Panel cannot be accessed');
        }
    } catch (err) {
        console.log(err);
    }
    res.redirect("/manage-lockers/?bldg=" + req.body.building + "&flr=" + req.body.level);
};

exports.panel_delete = async function (req, res) {
    try {
        var panel = await Panel.findById(req.body.panelid);

        panel.lockers.forEach(async (locker) => { await Locker.findByIdAndDelete(locker._id) });
        await Panel.findByIdAndDelete(req.body.panelid);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/manage-lockers/?bldg=" + req.body.building + "&flr=" + req.body.level);
}; 
