
module.exports.userIsLoggedIn = function(req, res, next) {
    if (req.session.token)
        next();
    else
        res.redirect('/login');
}

module.exports.userIsNew = function(req, res, next) {
    const User = require('./model/user.model');

    User.findOne({'email': req.session.passport.user.profile.emails[0].value}, 
        function (err, user) {
            if (err) {
                console.log(err);
                next();
            } else if (user) {
                next();
            } else {
                res.redirect('/register');
            }
        }
    );
}

