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
                    idNum: req.session.idNum,
                    type: req.session.type      
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
                        idNum: req.session.idNum,
                        type: req.session.type      
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

        var titleString = "Locker #" + req.body.lockernumber;
        var descString = titleString + ", " + paneltype + " Panel #" + panel.number +
                         ", " + panel.building + ", " + panel.level + "/F"; 
       
        var reservation = new Reservation({
            title: titleString,
            userID: req.session.idNum,
            item: lockerid,
            status: 'Pending',
            description: descString,
            onItemType: 'Locker'
        });
        await reservation.save();
    } catch (err) {
        console.log(err);
    }
    res.redirect("/reservations");
};

exports.equipment = async function (req, res) {
    try {
        equipment = await Equipment.find({});
        res.render('equipment-form', {
            active: { active_index: true },
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
                idNum: req.session.idNum,
                type: req.session.type      
            },
            equipmentList: equipment
        });
    } catch (err) {
        console.log(err);
    }
};

exports.reserve_equipment = async function (req, res) {
    try {
        var equipment = await Equipment.findById(req.body.equipmentid);
        var equipmentid = req.body.equipmentid;
        var reason = req.body.reason;

        var descString = equipment.name + ", " + reason;
        var pickupDate = new Date();

        do {
            pickupDate.setDate(pickupDate.getDate()+1);
        }   //0 is Sunday, 5 is Friday, 6 Saturday
        while (pickupDate.getDay()==0 || pickupDate.getDay()==5 || pickupDate.getDay()==6);

        switch(parseInt(req.body.borrowtime)) {
            case 1: pickupDate.setHours(7,30,0); break;
            case 2: pickupDate.setHours(9,15,0); break;
            case 3: pickupDate.setHours(11,0,0); break;
            case 4: pickupDate.setHours(12,45,0); break;
            case 5: pickupDate.setHours(14,30,0); break;
            case 6: pickupDate.setHours(16,15,0); break;
            default: pickupDate.setHours(0,0,0);
        }

        var reservation = new Reservation({
            title: equipment.name,
            userID: req.session.idNum,
            item: equipmentid, 
            status: 'Pending',
            description: descString,
            onItemType: 'Equipment',
            pickupPayDate: pickupDate
        });
        await reservation.save();
    } catch (err) {
        console.log(err);
    }
    res.redirect("/reservations");
};
