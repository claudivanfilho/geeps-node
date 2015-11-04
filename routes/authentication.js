var express = require('express');
var router = express.Router();
var path = require('path');
var Empresa = require('../models/empresa');
var Usuario = require('../models/usuario');
var Pedido = require('../models/pedido');
var Entregador = require('../models/entregador');
var passport = require('passport');

router.post('/login', function(req, res, next) {
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
                console.log("opa");
                return res.status(200).send("empresa inativa")
            } else {
                return res.status(200).send('login ok');
            }
        });
    })(req, res, next);
});

router.get('/*', function(req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    return res.sendFile(path.join(__dirname+'/../public/templates/layouts/access.html'));
});

module.exports = router;
