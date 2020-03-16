const User = require('../model/user.model');

exports.viewProfile = function (req, res) {
    res.render('profile-page', {
        active: { active_profile: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
};