var express = require('express');
var path = require('path');
var router = express.Router();
var Empresa = require('../models/empresa');
var Usuario = require('../models/usuario');
var Entregador = require('../models/entregador');

router.get('/empresas', function(req, res, next) {
    Empresa.find(function(err, empresas) {
        res.send(empresas);
    })
});

router.get('/usuarios', function(req, res, next) {
    Usuario.find(function(err, usuarios) {
        res.send(usuarios);
    })
});

router.get('/entregadores', function(req, res, next) {
    Entregador.find(function(err, entregadores) {
        res.send(entregadores);
    })
});

module.exports = router;