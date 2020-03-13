const express = require('express');
const hbs = require('hbs');
const port = 3000;
const mongoose = require('mongoose');

// const Equipment = require('./model/equipment');

const app = express();

/* mongoose.connect('mongodb+srv://root:p@ssword@cluster0-wovzq.gcp.mongodb.net/test?retryWrites=true&w=majority', {
    useMongoClient: true
}) */

app.use(express.static('public'));

app.set('view engine', 'hbs');

// hbs.registerHelper();

hbs.registerPartials(__dirname + '/views/partials');

app.get('(/index.html)?', function (req, res) {
    res.render('index', {
        active: { active_index: true } // indicates which page is active in the nav partial.
    });
});

app.get('/equipment(-form.html)?', function (req, res) {
    res.render('equipment-form', {
        active: { active_index: true }
    });
});

app.get('/locker(-form.html)?', function (req, res) {
    res.render('locker-form', {
        active: { active_index: true }
    });
});

app.get('/profile(-page.html)?', function (req, res) {
    res.render('profile-page', {
        active: { active_profile: true }
    });
});

app.get('/my-reservations(-page.html)?', function (req, res) {
    res.render('my-reservations-page', {
        active: { active_my_reservations: true }
    });
});

app.get('/terms(-page.html)?', function (req, res) {
    res.render('terms-page', {
        active: { active_terms: true }
    });
});

app.get('/about-us(-page.html)?', function (req, res) {
    res.render('about-us-page', {
        active: { active_about_us: true }
    });
});

app.get('/manage-reservations(-page.html)?', function (req, res) {
    res.render('manage-reservations-page', {
        active: { active_manage_reservations: true }
    });
});

app.get('/manage-lockers(-page.html)?', function (req, res) {
    res.render('manage-lockers-page', {
        active: { active_manage_lockers: true }
    });
});

app.get('/manage-equipment(-page.html)?', function (req, res) {
    res.render('manage-equipment-page', {
        active: { active_manage_equipment: true }
    });
});

app.get('/login(-page.html)?', function (req, res) {
    res.render('login-page');
});

app.get('/register(.html)?', function (req, res) {
    res.render('register');
});

app.listen(port, function () {
    console.log('Listening at port ' + port);
});
