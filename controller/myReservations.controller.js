const Reservation = require('../model/reservation.model');

exports.myReservations = function (req, res) {
    res.render('my-reservations-page', {
        active: { active_my_reservations: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
};