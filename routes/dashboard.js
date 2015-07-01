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

    Empresa.findOne({email: req.user.email}).populate('pedidos').exec(function(err, empresa){
        Pedido.find({empresa: req.user._id}).populate(['endereco_entrega', 'usuario', 'entregador']).exec(function(err, pedidos){
            Pedido.populate(pedidos, {path: 'entregador.usuario', model:'Usuario'}, function(err, pedidos){
                Entregador.find({empresa: empresa._id}).populate('usuario').exec(function(err, entregadores){
                    return res.render('dashboard', {
                        'empresa' : empresa,
                        'entregadores': entregadores,
                        'pedidos' : pedidos
                    });
                });
            });
        });
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out!";
});

router.get('/perfil', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    return res.render('empresa/perfil', {'empresa' : req.empresa});
});

router.post('/perfil/editar', function(req, res){
    var nome = req.body.nome;
    var email = req.body.email;
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    //TODO
    return res.redirect('/empresa/perfil');
});

module.exports = router;