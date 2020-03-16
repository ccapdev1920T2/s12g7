const path = require('path');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const port = 3000;
const app = express();
// Handlebars
app.set('view engine', 'hbs');

// Express static files
app.use(express.static(path.join(__dirname, 'public')));

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
const index = require('./routes/index.routes');
const profile = require('./routes/user.routes');
const reserve = require('./routes/reserve.routes');
const myReservations = require('./routes/myReservations.routes');

// Connecting to the db
mongoose.connect('mongodb://localhost:27017/',
    { useNewUrlParser: true, useUnifiedTopology: true }
).catch(err => {
    console.log('Error connecting to the db: ' + err);
});

hbs.registerPartials(__dirname + '/views/partials');

app.use('/', index);
app.use('/profile', userIsLoggedIn, profile);
app.use('/reserve', userIsLoggedIn, reserve);
app.use('/my-reservations', userIsLoggedIn, myReservations);

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

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
    // TODO: create 404 page
})

app.listen(port, function () {
    console.log('Listening at port ' + port);
});

// Middleware
function userIsLoggedIn(req, res, next) {
    if (req.session.token)
        next();
    else
        res.redirect('/login');
}