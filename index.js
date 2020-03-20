const path = require('path');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const port = 3000;
const app = express();

// Handlebars
app.set('view engine', 'hbs');

// Express static files
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// My middleware
const UserAuth = require('./user-middleware');

// Routes
const index = require('./routes/index.routes');
const profile = require('./routes/user.routes');
const reserve = require('./routes/reserve.routes');
const myReservations = require('./routes/myReservations.routes');
const panel = require('./routes/panel.routes');
const equipment = require('./routes/equipment.routes');

// Connecting to the db
mongoose.connect('mongodb://localhost:27017/ccapdev',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
).catch(err => {
    console.log('Error connecting to the db: ' + err);
});

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('lockernumber', function (str) {return JSON.parse(JSON.stringify(str)).number;});
hbs.registerHelper('lockerstatus', function (str) {return JSON.parse(JSON.stringify(str)).status;});
// capitalizeFirst capitalizes the first character of the text/string parameter
hbs.registerHelper('capitalizeFirst', function (text) {return text[0].toUpperCase() + text.slice(1);});

app.use('/', index);
app.use('/profile', UserAuth.userIsLoggedIn, UserAuth.userIsNew, profile);
app.use('/reserve', UserAuth.userIsLoggedIn, UserAuth.userIsNew, reserve);
app.use('/my-reservations', UserAuth.userIsLoggedIn, UserAuth.userIsNew, myReservations);
app.use('/manage-lockers', UserAuth.userIsLoggedIn, UserAuth.userIsNew, panel);
app.use('/manage-equipment', UserAuth.userIsLoggedIn, UserAuth.userIsNew, equipment);

app.get('/manage-reservations(-page.html)?', function (req, res) {
    res.render('manage-reservations-page', {
        active: { active_manage_reservations: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum
        }
    });
});

// app.use(multer({ dest: './uploads/',
//     rename: function (fieldname, filename) {
//       return filename;
//     },
// }));

app.use(function (req, res, next) {
    res.status(404).render('404-page', {
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum        
        }
    });
})

app.listen(port, function () {
    console.log('Listening at port ' + port);
});
