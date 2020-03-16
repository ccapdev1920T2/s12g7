const User = require('../model/user.model');
const passport = require('passport');

exports.home = function (req, res) {

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

exports.terms = function (req, res) {
    res.render('terms-page', {
        active: { active_terms: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
};

exports.about = function (req, res) {
    res.render('about-us-page', {
        active: { active_about_us: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
}

exports.signin = passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'],
    hostedDomain: 'dlsu.edu.ph'
});

exports.callback = passport.authenticate('google', {
    failureRedirect: '/login'
});

exports.callback_success = function (req, res) {
    req.session.token = req.user.token;
    res.redirect('/');
};

exports.register = function (req, res) {
    var colleges = User.schema.path('college').enumValues;

    res.render('register', {
        colleges: colleges,
        email: req.session.passport.user.profile.emails[0].value
    });
};

exports.login = function (req, res) {
    res.render('login-page');
};

exports.logout = function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
};