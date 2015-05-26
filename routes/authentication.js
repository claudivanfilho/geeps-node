var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var Empresa = require('../models/empresa');
var LocalStrategy = require('passport-local').Strategy;

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

router.get('/login', function(req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    return res.render('auth/login');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
        if (err) { return
            return res.render('auth/login', {message: err});
        }
        if (!user) {
            return res.render('auth/login', {message: info.message});
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/empresa/dashboard');
        });
    })(req, res, next);
});

module.exports = router;