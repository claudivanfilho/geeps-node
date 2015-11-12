var express = require('express');
var router = express.Router();
var path = require('path');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");
var gcm = require('../config/gcm-service');
var mongoose = require('mongoose');

router.post('/empresa/pedido', function(req, res) {
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var nome_cliente = req.body.nome_cliente;
    var telefone_cliente = req.body.telefone_cliente;
    var id_entregador = req.body.id_entregador;

    Usuario.find({
        telefone: telefone_cliente
    }, function(err, usuarios) {
        var cliente;
        if (usuarios.length == 0) {
            cliente = new Usuario({
                telefone: telefone_cliente
            });
            cliente.save();
        } else {
            cliente = usuarios[0];
        }

        var endereco_entrega = new Endereco({
            rua: rua,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        });
        var pedido = new Pedido({
            nome_cliente: nome_cliente,
            status: "REGISTRADO",
            empresa: req.user._id,
            endereco_entrega: endereco_entrega._id,
            cliente: cliente._id
        });

        // pega o entregador e salva o pedido
        if (id_entregador == "" || id_entregador == undefined) {
             endereco_entrega.save();
             pedido.entregador = null;
             pedido.save(function() {
                 // manda uma notificação para o cliente via GCM
                 gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status);
                 return res.status(200).json({
                     title:"Pedido cadastrado com sucesso.",
                     message : "Será enviada uma notificação para o celular do cliente."
                 });
             });
        } else {
            Entregador.findOne({
                _id: id_entregador
            }).populate(['usuario']).exec(function(err, entregador) {
                if (!entregador) {
                    return res.status(500).json({
                        title : "Erro ao cadastrar pedido",
                        message : 'Entregador não existe'
                    });
                }
                if (entregador.usuario._id == cliente._id) {
                    return res.status(500).json({
                        title : "Erro ao cadastrar pedido",
                        message : 'Não é possível cadastrar um pedido para o próprio Entregador'
                    });
                }
                endereco_entrega.save();
                pedido.entregador = entregador._id;
                pedido.save(function() {
                    // manda uma notificação para o cliente via GSM e também para o entregador
                    gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status, entregador._id);
                    gcm.sendGCMToEntregador(entregador.usuario.regId, req.user.nome, entregador._id);
                    return res.status(200).json({
                        title:"Pedido cadastrado com sucesso.",
                        message : "Será enviada uma notificação para o celular do cliente e entregador."
                    });
                });
            });
        }
    });
});

router.post('/empresa/pedido/editar', function(req, res) {
    var numero_cliente = req.body.telefone_cliente;

    var pedidodata = {};
    var enderecodata = {};

    if (req.body.rua)
        enderecodata.rua = req.body.rua;
    if (req.body.nome_cliente)
        pedidodata.nome_cliente = req.body.nome_cliente
    if (req.body.numero)
        enderecodata.numero = req.body.numero;
    if (req.body.bairro)
        enderecodata.bairro = req.body.bairro;
    if (req.body.cidade)
        enderecodata.cidade = req.body.cidade;
    if (req.body.estado)
        enderecodata.estado = req.body.estado;
    if (req.body.id_entregador)
        pedidodata.entregador = mongoose.Types.ObjectId(req.body.id_entregador);
    if (req.body.id_entregador == "")
        pedidodata.entregador = null;

    if (JSON.stringify(pedidodata) != '{}') {
        Pedido.update({
            _id: req.body.id_pedido
        }, pedidodata, {
            upsert: true
        }).exec(function(err) {
            if (err) {
                return res.status(500).send("Erro interno.");
            }
        });
    }

    if (JSON.stringify(enderecodata) != '{}') {
        Endereco.update({
            _id: req.body.id_endereco
        }, enderecodata, {
            upsert: true
        }).exec(function(err) {
            if (err) {
                return res.status(500).send("Erro interno.");
            }
        });
    }
    return res.status(200).send("Pedido atualizado com sucesso.");

});

router.post('/empresa/pedido/excluir', function(req, res) {
    Pedido.update({
        _id: req.body.id_pedido
    }, {
        deleted : true
    }, {
        upsert: true
    }).exec(function(err) {
        if (err) {
            return res.status(500).send("Erro interno.");
        }
        return res.status(200).send("Pedido deletado com sucesso");
    });
});

router.post('/empresa/pedido/setstatus', function(req, res) {
    Pedido.update({
        _id: req.body.id_pedido
    }, {
        status: req.body.newstatus
    }, {
        upsert: true
    }).exec(function(err) {
        if (err) {
            return res.status(500).send("Ocorreu um erro interno.");
        }
        res.status(200).send("Status atualizado com sucesso.");
    });
});

module.exports = router;
