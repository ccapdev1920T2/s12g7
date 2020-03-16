const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const port = 3000;
const app = express();

// Handlebars
app.set('view engine', 'hbs');

// Express static files
app.use(express.static('public'));

// Google OAuth
const passport = require('passport');
const auth = require('./auth');

// Cookies and session
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

// Passport for Google oauth
auth(passport);
app.use(passport.initialize());

// Cookies and sessions
app.use(cookieSession({
    name: 'session',
    keys: ['123']
}));
app.use(cookieParser());

// Routes
const user = require('./routes/user');
const home = require('./routes/home');

// Connecting to the db
mongoose.connect('mongodb://localhost:27017/',
    { useNewUrlParser: true, useUnifiedTopology: true }
).catch(err => {
    console.log('Error connecting to the db: ' + err);
});

hbs.registerPartials(__dirname + '/views/partials');

app.use('/', user);
app.use('/', home);

app.get('/equipment(-form.html)?', function (req, res) {
    res.render('equipment-form', {
        active: { active_index: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/locker(-form.html)?', function (req, res) {
    res.render('locker-form', {
        active: { active_index: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/profile(-page.html)?', function (req, res) {
    res.render('profile-page', {
        active: { active_profile: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/my-reservations(-page.html)?', function (req, res) {
    res.render('my-reservations-page', {
        active: { active_my_reservations: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/terms(-page.html)?', function (req, res) {
    res.render('terms-page', {
        active: { active_terms: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/about-us(-page.html)?', function (req, res) {
    res.render('about-us-page', {
        active: { active_about_us: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/manage-reservations(-page.html)?', function (req, res) {
    res.render('manage-reservations-page', {
        active: { active_manage_reservations: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/manage-lockers(-page.html)?', function (req, res) {
    res.render('manage-lockers-page', {
        active: { active_manage_lockers: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/manage-equipment(-page.html)?', function (req, res) {
    res.render('manage-equipment-page', {
        active: { active_manage_equipment: true },
        sidebarData: { 
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
});

app.get('/login(-page.html)?', function (req, res) {
    res.render('login-page');
});

app.listen(port, function () {
    console.log('Listening at port ' + port);
});
