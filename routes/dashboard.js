var express = require('express');
var router = express.Router();
var path = require('path');
var Empresa = require('../models/empresa');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");


router.get('/dashboard', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Empresa.find({email: req.user.email}).populate('pedidos').exec(function(err, empresas){
        Entregador.find({empresa: empresas[0]._id}, function(err, entregadores){
            return res.render('dashboard', {'empresa' : empresas[0], 'entregadores': entregadores});
        });
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out!";
});

module.exports = router;