var express = require('express');
var router = express.Router();
var path = require('path');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");
var gcm = require('../config/gcm-service');

router.post('/pedido', function(req, res) {
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
        if (id_entregador == "") {
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
                    gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status);
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

router.post('/pedido/editar', function(req, res) {
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var nome_cliente = req.body.nome_cliente;
    var numero_cliente = req.body.telefone_cliente;
    var id_entregador = req.body.id_entregador;

    // TODO UPDATE NÚMERO DO CLIENTE

    // TODO NÂO É PRA CRIAR UM NOVO ENDERECO!!! APENAS DAR UPDATE EM UM ENDERECO QUE JA EXISTE `-´
    var endereco = new Endereco({
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado
    });
    endereco.save();
    // =================================================

    Pedido.update({
        _id: req.body.id_pedido
    }, {
        nome_cliente: nome_cliente,
        endereco_entrega: endereco,
        entregador: id_entregador
    }, {
        upsert: true
    }).exec(function(err) {
        return res.status(200).send("Pedido atualizado com sucesso.");
    });
});

router.post('/pedido/excluir', function(req, res) {
    Pedido.findOne({
        _id: req.body.id_pedido
    }, function(err, pedido) {
        if (err) {
            return res.redirect('/empresa/dashboard', {
                message: "Ocorreu um erro interno"
            });
        }
        if (pedido) {
            Pedido.findByIdAndRemove(pedido._id).exec();
            Endereco.findByIdAndRemove(pedido.endereco_entrega).exec();
            return res.status(200).send("Pedido deletado com sucesso");
        } else {
            return res.status(500).send("Pedido não existe");
        }
    });
});

router.post('/pedido/setstatus', function(req, res) {
    Pedido.find({
        _id: req.body.id_pedido
    }, function(err, pedido) {
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
});

module.exports = router;
