const User = require('../model/user.model');

exports.profile_details = async function (req, res) {
    try {
        var user = await User.findOne({ idNum: req.params.idNum });
        if (user) {
            if (user.idNum == req.session.idNum) // user is the same as logged in user
                res.render('profile-page', {
                    active: { active_profile: true },
                    sidebarData: {
                        dp: req.session.passport.user.profile.photos[0].value,
                        name: req.session.passport.user.profile.displayName,
                        idNum: req.session.idNum
                    },
                    user: user
                });
            else
                res.redirect('/404');
        } else {
            console.log('user cannot be accessed');
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }    
};

exports.profile_update = async function(req, res) {
    try {
        const filter = { email: req.session.passport.user.profile.emails[0].value };
        const update = { contactNum: req.body.phone };
        await User.findOneAndUpdate(filter, update);

        res.redirect('/profile');

    } catch(err) {
        console.log(err);
    }
}