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
    Pedido.find({empresa: req.user._id}).populate(['endereco_entrega', 'usuario', 'entregador'])
        .exec(function(err, pedidos){
            Pedido.populate(pedidos, {path: 'entregador.usuario', model:'Usuario'}, function(err, pedidos){
                return res.render('pedidos', {'pedidos' : pedidos});
            })
    });
});

router.get('/pedido', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Entregador.find({empresa : req.user._id}).populate('usuario').exec(function (err, entregadores) {
        return res.render('pedido', {'entregadores' : entregadores});
    });
});

router.post('/pedido', function(req, res){
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var nome_cliente = req.body.nome_cliente;
    var numero_cliente = req.body.telefone_cliente;
    var numero_entregador = req.body.telefone_entregador;

    Usuario.find({
        telefone: numero_cliente
    },function(err, usuarios){
        var cliente;
        if (usuarios.length == 0) {
            cliente = new Usuario({
                telefone : numero_cliente,
                nome : nome_cliente
            });
            cliente.save();
        } else {
            cliente = usuarios[0];
        }
        // pega o entregador
        Usuario.findOne({telefone:numero_entregador}, function(err, user) {
            Entregador.findOne({usuario : user._id}, function(err, entregador) {
                var endereco_entrega = new Endereco({
                    rua : rua,
                    numero : numero,
                    bairro : bairro,
                    cidade : cidade,
                    estado : estado
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
            })
        })
    });
});

router.post('/pedido/editar', function(req, res){
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var nome_cliente = req.body.nome_cliente;
    var numero_cliente = req.body.telefone_cliente;
    var numero_entregador = req.body.telefone_entregador;
    //TODO
    return res.redirect('/empresa/pedidos');
});

router.post('/pedido/excluir', function(req, res){
    Pedido.remove({_id:req.body.id_pedido}, function(err){
        if(err){
            return res.redirect('/empresa/dashboard', {message: "Ocorreu um erro interno"});
        }
    });
    return res.redirect('/empresa/pedidos');
});

module.exports = router;