var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

router.get('/auth/login', function(req, res, next) {
    return res.sendFile(path.join(__dirname+'/../public/templates/layouts/access.html'));
});

router.get('/auth/register', function(req, res, next) {
    return res.sendFile(path.join(__dirname+'/../public/templates/layouts/access.html'));
});

router.post('/auth/login', function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
        if (err) {
            return res.status(500).send("error no servidor");
        }
        if (!user) {
            return res.status(500).send(info.message);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            if (user.inativa) {
                return res.status(200).send("empresa inativa")
            } else {
                return res.status(200).send('login ok');
            }
        });
    })(req, res, next);
});

router.post('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out!";
});

module.exports = router;
