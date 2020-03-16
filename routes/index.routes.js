const index_controller = require('../controller/index.controller');

const express = require('express');
const router = express.Router();

function userIsLoggedIn(req, res, next) {
    if (req.session.token)
        next();
    else
        res.redirect('/login');
}

router.get('/', userIsLoggedIn, index_controller.home);

router.get('/terms', userIsLoggedIn, index_controller.terms);

router.get('/about', userIsLoggedIn, index_controller.about);

router.get('/auth/google', index_controller.signin);

router.get('/auth/google/callback', index_controller.callback, index_controller.callback_success);

router.get('/register', userIsLoggedIn, index_controller.register);

router.get('/login', index_controller.login);

router.get('/logout', userIsLoggedIn, index_controller.logout);


module.exports = router;