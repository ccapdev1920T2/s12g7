const User = require('../model/user.model');

exports.profile_details = async function (req, res) {
    try {
        var user = await User.findOne({ email: req.session.passport.user.profile.emails[0].value });
        if (user) {
            res.render('profile-page', {
                active: { active_profile: true },
                sidebarData: {
                    dp: req.session.passport.user.profile.photos[0].value,
                    name: req.session.passport.user.profile.displayName,
                },
                user: user
            });
        } else {
            console.log('user cannot be accessed')
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        redirect('/');
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