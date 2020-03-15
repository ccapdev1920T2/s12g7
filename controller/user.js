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
}