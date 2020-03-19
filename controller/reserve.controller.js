const Equipment = require('../model/equipment.model');
const Panel = require('../model/panel.model');
const Reservation = require('../model/reservation.model');

exports.locker = function (req, res) {
    if (req.query.bldg != null && req.query.flr != null) {

        Panel.find({building: req.query.bldg, level: req.query.flr}, function(err, panel) {
            if (err) return next(err);
            
            Panel.find({building: req.query.bldg}).distinct('level', function(err, panel_floor) {
                if (err) return next(err);
    
                Panel.find().distinct('building', function(err, panel_building) {
                    if (err) return next(err);
                    res.render('locker-form', {
                        active: { active_index: true },
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
    else if (req.query.bldg != null) {
        Panel.find({building: req.query.bldg}).distinct('level', function(err, panel_floor) {
            if (err) return next(err);

            if (panel_floor[0] != null) {
                panel_floor = panel_floor.sort();
                res.redirect("/reserve/locker?bldg=" + req.query.bldg + "&flr=" + panel_floor[0]);
            }
            else {
                res.redirect("/reserve/locker");
            }
        });
    }
    // if no query
    else {
        Panel.find().distinct('building', function(err, panel_building) {
            if (err) return next(err);

            if (panel_building[0] != null) {
                Panel.find({building: panel_building[0]}).distinct('level', function(err, panel_floor) {
                    if (err) return next(err);
                    panel_floor = panel_floor.sort();
                    res.redirect("/reserve/locker?bldg=" + panel_building[0] + "&flr=" + panel_floor[0]);
                });
            }
            else {
                res.render('locker-form', {
                    active: { active_index: true },
                    sidebarData: { 
                        dp: req.session.passport.user.profile.photos[0].value,
                        name: req.session.passport.user.profile.displayName
                    }
                });
            }
        });
    }
};

exports.locker_reserve = async function (req, res) {
    var currentDate = new Date();
    let reservation = new Reservation({
        userID: req.body.userID, //TO DO: place correct parameter (maybe from session?)
        reservationType: 'locker', 
        date: currentDate,
        status: 'Pending',
        description: 'yes i do the cooking', //TO DO: not sure kung anong laman neto?
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

exports.equipment = function (req, res) {
    res.render('equipment-form', {
        active: { active_index: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum
        }
    });
};