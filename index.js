const express = require('express');
const hbs = require('hbs');
const port = 3000;

const app = express();

app.set('view engine', 'hbs');

// hbs.registerHelper();

// hbs.registerPartials();

/* app.get(<url>, function(req, res) {

}); */

app.listen(port, function () {
    console.log('Listening at port ' + port);
});