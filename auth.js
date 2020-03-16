const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy(
        {
            clientID: '***REMOVED***',
            clientSecret: '***REMOVED***',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function (token, refreshToken, profile, done) {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};