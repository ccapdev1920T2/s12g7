exports.index = function (req, res) {

    /* var reservation = new Reservation({
        userID: 11826401,
        reservationType: 'locker',
        status: 'Pending',
        Description: 'This is a description.',
        Remarks: 'This is remarkable.'
    });
    await reservation.save().catch(err => {
        console.log('Error writing to db');
    }); // TODO: test using CREATE method instead */

    if (req.session.token) {
        res.cookie('token', req.session.token);
        res.render('index', {
            active: { active_index: true }, // indicates which page is active in the nav partial.
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
            }
        });
    } else {
        res.cookie('token', '')
        res.redirect('/auth/google');
    }
};