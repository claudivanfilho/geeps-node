var Empresa = require('./../models/empresa');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local-signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            process.nextTick(function() {
                Empresa.findOne({ email: email, senha:password }, function (err, empresa) {

                    if (err) { return done(err); }
                    if (!empresa) {
                        return done(null, false, { message: 'Incorrect email or password.' });
                    }
                    //if (!user.validPassword(password)) {
                    //return done(null, false, { message: 'Incorrect password.' });
                    //}
                    return done(null, empresa);
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    return (passport, app);
}