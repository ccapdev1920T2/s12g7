const express = require('express');
const hbs = require('hbs');
const port = 3000;

const app = express();

app.use(express.static('public'));

app.set('view engine', 'hbs');

// hbs.registerHelper();

// hbs.registerPartials();

app.get('(/index.html)?', function(req, res) {
    res.render('index');
});

app.get('/equipment(-form.html)?', function(req, res) {
    res.render('equipment-form');
});

app.get('/locker(-form.html)?', function(req, res) {
    res.render('locker-form');
});

app.get('/my-reservations(-page.html)?', function(req, res) {
    res.render('my-reservations-page');
});

app.get('/terms(-page.html)?', function(req, res) {
    res.render('terms-page');
});

app.get('/about-us(-page.html)?', function(req, res) {
    res.render('about-us-page');
});

app.listen(port, function () {
    console.log('Listening at port ' + port);
});
