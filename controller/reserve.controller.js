const Equipment = require('../model/equipment.model');
const Locker = require('../model/locker.model');
const Reservation = require('../model/reservation.model');

exports.locker = function (req, res) {
    res.render('equipment-form', {
        active: { active_index: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    })
};

exports.equipment = function (req, res) {
    res.render('locker-form', {
        active: { active_index: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
};