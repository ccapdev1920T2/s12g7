const User = require('../model/user.model');
const passport = require('passport');
const hbs = require('hbs');

hbs.registerHelper('isAdmin', (type) => {
    return type == 'studentRep';
});

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

    res.cookie('token', req.session.token);
    res.render('index', {
        active: { active_index: true }, // indicates which page is active in the nav partial.
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum,
            type: req.session.type      
        }
    });
};

exports.terms = function (req, res) {
    res.render('terms-page', {
        active: { active_terms: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum,
            type: req.session.type      
        }
    });
};

exports.about = function (req, res) {
    res.render('about-us-page', {
        active: { active_about_us: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum,
            type: req.session.type      
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

exports.callback_success = async function (req, res) {
    req.session.token = req.user.token;

    try {
        var user = await User.findOneAndUpdate(
            { email: req.session.passport.user.profile.emails[0].value },
            { dpURL: req.session.passport.user.profile.photos[0].value });
        if (user) {
            req.session.idNum = user.idNum;
            req.session.type = user.type;
        }
        else
            console.log('user cannot be accessed');
    } catch (err) {
        console.log(err);
    }

    res.redirect('/');
};

exports.register_get = async function (req, res) {
    var colleges = User.schema.path('college').enumValues;

    console.log(req.session.passport.user.profile.photos[0].value);

    try {
        var user = await User.findOne({ email: req.session.passport.user.profile.emails[0].value });
        if (user == null) {
            res.render('register', {
                colleges: colleges,
                email: req.session.passport.user.profile.emails[0].value
            });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
};

exports.register_post = async function (req, res) {

    console.log('register: ' + req.session.passport.user.profile.photos[0].value);

    var user = new User({
        firstName: req.session.passport.user.profile.name.givenName,
        lastName: req.session.passport.user.profile.name.familyName,
        email: req.session.passport.user.profile.emails[0].value,
        idNum: req.body.idNum,
        college: User.schema.path('college').enumValues[req.body.college],
        degreeProg: req.body.degProg,
        contactNum: req.body.phone,
        type: 'student',
        dpURL: req.session.passport.user.profile.photos[0].value
    });

    try {
        var user = await user.save();
        req.session.idNum = user.idNum;
        req.session.type = user.type;
    } catch (err) {
        console.log('Error writing to db: ' + err);
    }
    res.redirect('/');
};

exports.login = function (req, res) {
    if (req.session.token)
        res.redirect('/');
    else
        res.render('login-page');
};

exports.logout = function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
};