var express = require('express');
var router = express.Router();
var path = require('path');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");
var gcm = require('../config/gcm-service');

router.get('/pedidos', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Entregador.find({empresa : req.user._id}).populate('usuario').exec(function (err, entregadores) {

        Pedido.find({empresa: req.user._id}).populate(['endereco_entrega', 'usuario', 'entregador'])
            .exec(function (err, pedidos) {
                Pedido.populate(pedidos, {path: 'entregador.usuario', model: 'Usuario'}, function (err, pedidos) {
                    console.log(entregadores.length);
                    return res.render('pedidos', {'pedidos': pedidos , 'entregadores' : entregadores});
                })
            });
    })
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

        var endereco_entrega = new Endereco({
            rua : rua,
            numero : numero,
            bairro : bairro,
            cidade : cidade,
            estado : estado
        });
        var pedido = new Pedido({
            status: "EM ANDAMENTO",
            empresa: req.user._id,
            endereco_entrega: endereco_entrega._id,
            usuario: cliente._id
        });

        // pega o entregador e
        if (numero_entregador == "") {
            endereco_entrega.save();
            pedido.entregador = null;
            pedido.save(function(){
                // manda uma notificação para o cliente via GSM
                gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status);
                return res.redirect('/empresa/dashboard');
            });
        } else {
            Usuario.findOne({telefone:numero_entregador}, function(err, user) {
                Entregador.findOne({usuario : user._id}, function(err, entregador) {
                    endereco_entrega.save();
                    pedido.entregador = entregador._id;
                    pedido.save(function(){
                        // manda uma notificação para o cliente via GSM
                        gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status);
                        return res.redirect('/empresa/dashboard');
                    });
                });
            });
        }
    });
});

router.get('/pedido/editar', function(req, res){
    var pedidoId = req.query.entid;
    console.log(req.query.entid);
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Entregador.find({empresa : req.user._id}).populate('usuario').exec(function (err, entregadores) {
        Pedido.findOne({_id: pedidoId}).populate(['endereco_entrega', 'usuario', 'entregador']).exec(function (err, pedido) {
            Entregador.findOne({_id: pedido.entregador._id}).populate('usuario').exec(function(err, entregador){
                for(i = 0; i<entregadores.length;i++){
                    if (entregadores[i]._id.equals(entregador._id) ){
                        entregadores[i] = entregadores[0];
                    }
                }
                entregadores[0]= entregador;
                return res.render('editarPedido', {'pedido': pedido, 'entregadores': entregadores});
            });

        });
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
    var id_entregador = req.body.id_entregador;

    var endereco = new Endereco({
        rua : rua,
        numero : numero,
        bairro : bairro,
        cidade : cidade,
        estado : estado
    });
    endereco.save();
    Entregador.findOne({ _id: id_entregador}).exec(function(err, novo_entregador){
        Pedido.update(
            {_id: req.body.pedidoId},
            { endereco_entrega: endereco,
            entregador: novo_entregador},
            {upsert: true}).exec(function(err){
            return res.redirect('/empresa/pedidos');
        });
    });


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