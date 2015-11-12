var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    return res.sendFile(path.join(__dirname+'/../public/templates/index.html'));
});

router.get('/*', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    if (req.user.inativa) {
        return res.sendFile(path.join(__dirname+'/../public/templates/layouts/baseInative.html'));
    } else {
        return res.sendFile(path.join(__dirname+'/../public/templates/layouts/base.html'));
    }
});

module.exports = router;
