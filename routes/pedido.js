var express = require('express');
var router = express.Router();
var path = require('path');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");

router.get('/pedidos', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Pedido.find({empresa: req.user._id}).populate(['endereco_entrega', 'usuario', 'entregador']).exec(function(err, pedidos){
        return res.render('pedidos', {'pedidos' : pedidos});
    });
});

router.get('/pedido', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../views/pedido.html'));
});


router.post('/pedido', function(req, res){
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var num_cliente = req.body.cliente;
    var num_entregador = req.body.entregador;

    if (endereco.trim() == "") {
        return res.render('empresa/pedido', {message: "Endereço Requerido"});
    } else if (num_cliente.trim() == "") {
        return res.render('empresa/pedido', {message: "Número do Cliente Requerido"});
    } else if (num_entregador.trim() == "") {
        return res.render('empresa/pedido', {message: "Número do Entregador Requerido"});
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

module.exports = router;