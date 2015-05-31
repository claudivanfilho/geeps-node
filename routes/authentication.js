var express = require('express');
var router = express.Router();
var Empresa = require('../models/empresa');
var passport = require('passport');

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