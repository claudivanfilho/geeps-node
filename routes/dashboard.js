var express = require('express');
var router = express.Router();
var path = require('path');
var Empresa = require('../models/empresa');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");

router.get('/pedidos', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Pedido.find({empresa: req.user._id}).populate('endereco_entrega').exec(function(err, pedidos){
        return res.render('pedidos', {'pedidos' : pedidos});
    });
});

router.get('/pedido', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../views/pedido.html'));
});

router.get('/dashboard', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    //Empresa.find({email: req.user.email}).populate('pedidos').exec(function(err, empresas){
    //    return res.render('dashboard', {'empresa' : empresas[0]});
    //});

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

router.post('/pedido', function(req, res){
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var num_cliente = req.body.cliente;
    var num_entregador = req.body.entregador;

    if (endereco.trim() == "") {
        return res.render('empresa/pedido', {message: "Endere�o Requerido"});
    } else if (num_cliente.trim() == "") {
        return res.render('empresa/pedido', {message: "N�mero do Cliente Requerido"});
    } else if (num_entregador.trim() == "") {
        return res.render('empresa/pedido', {message: "N�mero do Entregador Requerido"});
    }
    Usuario.find({
        phone: req.body.cliente
    },function(err, usuarios){
        var cliente;
        if (usuarios.length == 0) {
            // cria um novo cliente
            cliente = new Usuario({phone : num_cliente});
            cliente.save();
        } else {
            cliente = usuarios[0];
        }
        var usuario = new Usuario({
            phone : num_entregador
        });
        usuario.save(function(){
            var entregador = new Entregador({
                usuario : usuario._id
            })
            entregador.save(function(){
                var endereco_entrega = new Endereco({
                    rua : endereco
                })
                endereco_entrega.save(function(){
                    var pedido = new Pedido({
                        status: "EM ANDAMENTO",
                        empresa: req.user._id,
                        endereco_entrega: endereco_entrega._id,
                        usuario: cliente._id,
                        entregador: entregador._id
                    });
                    pedido.save(function(){
                        return res.redirect('/empresa/dashboard');
                    });
                });
            });
        })
    });
});

router.get('/entregadores', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Empresa.find({email: req.user.email}, function(err, empresas){
        Entregador.find({empresa: empresas[0]._id}).populate('usuario').exec(function(err, entregadores){
            return res.render('entregadores', {'empresa' : empresas[0], 'entregadores': entregadores});
        });
    });
});

router.get('/entregador', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../views/entregador.html'));
});

router.post('/entregador', function(req, res){
    var num_entregador = req.body.entregador;

    if (num_entregador.trim() == "") {
        res.sendFile(path.join(__dirname+'/../views/entregador.html'), {message: "N�mero do Entregador Requerido"});
        //return res.render('empresa/entregador', {message: "N�mero do Entregador Requerido"});
    }
    Usuario.find({
        phone: req.body.entregador
    },function(err, usuarios){
        var user;
        if (usuarios.length == 0) {
            // cria um novo Usuario do sistema (Entregador tamb�m � usu�rio)
            user = new Usuario({phone : num_entregador});
            user.save(function(){
                var entregador = new Entregador({
                    usuario : usuario._id,
                    empresa: req.user._id
                })
                entregador.save(function(){
                    return res.redirect('/empresa/dashboard');
                });
            });
        } else {
            user = usuarios[0];
            
            Entregador.find(({empresa: req.user._id}, {usuario: user._id}), function (err, entregadores) {
                // Verifica se o telefone passado j� consta no banco de entregadores para determinada empresa
                if(entregadores.length == 0){
                    var entregador = new Entregador({
                        usuario : user._id,
                        empresa: req.user._id
                    })
                    entregador.save(function(){
                        return res.redirect('/empresa/dashboard');
                    });
                } else {
                    return res.redirect('/empresa/dashboard');
                }
            });
        }
    });
});

module.exports = router;