const User = require('../model/user');
const passport = require('passport');

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
}

exports.logout = function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
};