const Equipment = require('../model/equipment.model');
const Panel = require('../model/panel.model');
const Reservation = require('../model/reservation.model');

exports.locker = async function (req, res) {
    if (req.query.bldg != null && req.query.flr != null) {
        try {
            var panel = await Panel.find({ building: req.query.bldg, level: req.query.flr }).populate('lockers');
            var panel_floor = await Panel.find({ building: req.query.bldg }).distinct('level').populate('lockers');
            var panel_building = await Panel.find().distinct('building').populate('lockers');

            res.render('locker-form', {
                active: { active_index: true },
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
                res.redirect("/reserve/locker?bldg=" + req.query.bldg + "&flr=" + panel_floor[0]);
            }
            else {
                res.redirect("/reserve/locker");
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
                    res.redirect("/reserve/locker?bldg=" + panel_building[0] + "&flr=" + panel_floor[0]);
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                res.render('locker-form', {
                    active: { active_index: true },
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

exports.reserve_locker = async function (req, res) {
    try {
        var panel = await Panel.findById(req.body.panelid);
        var paneltype = panel.type[0].toUpperCase() + panel.type.slice(1);
        var lockerIndex = req.body.lockernumber - panel.lowerRange;
        var lockerid = panel.lockers[lockerIndex]._id;
        
        var descString = "Locker #" + req.body.lockernumber +", " + paneltype + " Panel #" + panel.number +
                         ", " + panel.building + ", " + panel.level + "/F"; 
       
        var reservation = new Reservation({
            userID: req.session.idNum, //TODO: place correct parameter (maybe from session?)
            onItemType: 'Locker',
            item: lockerid,
            status: 'Pending',
            description: descString,
            onItemType: 'Locker'
        });
        res.send(reservation);
        //await reservation.save();
    } catch (err) {
        console.log(err);
    }
};

exports.equipment = async function (req, res) {
    try {
        equipment = await Equipment.find({});
        res.render('equipment-form', {
            active: { active_index: true },
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
                idNum: req.session.idNum
            },
            equipmentList: equipment
        });
    } catch (err) {
        console.log(err);
    }
};

exports.reserve_equipment = async function (req, res) {
    var currentDate = new Date();
    var reservation = new Reservation({
        userID: req.body.userID, //TODO: place correct parameter (maybe from session?)
        onItemType: 'Equipment', 
        date: currentDate,
        status: 'Pending',
        description: 'yes i do the cooking', //TODO: not sure kung anong laman neto?
        remarks: 'yes i do the cleaning'
    });
    
    await reservation.save(function (err) {
        if (err) {
            console.log('Error writing reservation to db');
            res.send(reservation);
        } else {
            console.log('successful reservation write to db');
            res.send(reservation);
        }
    });
};
