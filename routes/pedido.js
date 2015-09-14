var express = require('express');
var router = express.Router();
var path = require('path');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");
var gcm = require('../config/gcm-service');

router.get('/pedidos', function (req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Entregador.find({empresa: req.user._id}).populate('usuario').exec(function (err, entregadores) {
        Pedido.find({empresa: req.user._id}).populate(['endereco_entrega', 'cliente', 'entregador']).exec(function (err, pedidos) {
            Pedido.populate(pedidos, {path: 'entregador.usuario', model: 'Usuario'}, function (err, pedidos) {
                return res.render('pedidos', {'pedidos': pedidos, 'entregadores': entregadores});
            });
        });
    });
});

router.get('/pedido', function (req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Entregador.find({empresa: req.user._id}, function (err, entregadores) {
        return res.render('pedido', {'entregadores': entregadores});
    });
});

router.post('/pedido', function (req, res) {
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var nome_cliente = req.body.nome_cliente;
    var telefone_cliente = req.body.telefone_cliente;
    var id_entregador = req.body.telefone_entregador;

    Usuario.find({
        telefone: telefone_cliente
    }, function (err, usuarios) {
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
            nome_cliente : nome_cliente,
            status: "REGISTRADO",
            empresa: req.user._id,
            endereco_entrega: endereco_entrega._id,
            cliente: cliente._id
        });

        // pega o entregador e salva o pedido
        if (id_entregador == "") {
            endereco_entrega.save();
            pedido.entregador = null;
            pedido.save(function () {
                // manda uma notificação para o cliente via GCM
                gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status);
                return res.redirect('/empresa/dashboard');
            });
        } else {
            Entregador.findOne({_id: id_entregador}).populate(['usuario']).exec(function (err, entregador) {
                if (entregador.usuario._id == cliente._id) {
                    Entregador.find({empresa: req.user._id}, function (err, entregadores) {
                        return res.render('pedido', {
                            'nome_cliente': nome_cliente,
                            'telefone_cliente': telefone_cliente,
                            'rua': rua,
                            'numero': numero,
                            'bairro': bairro,
                            'cidade': cidade,
                            'estado': estado,
                            'message': 'Não pode cadastrar um Pedido para o próprio Entregador',
                            'entregadores': entregadores
                        });
                    });
                }
                // TODO mandar mensagem de erro caso o entregador n exista

                endereco_entrega.save();
                pedido.entregador = entregador._id;
                pedido.save(function () {
                    // manda uma notificação para o cliente via GSM e também para o entregador
                    gcm.sendNotificacaoPedido(cliente.regId, req.user.nome, pedido.status);
                    gcm.sendGCMToEntregador(entregador.usuario.regId, req.user.nome, entregador._id);
                    return res.redirect('/empresa/dashboard');
                });
            });
        }
    });
});

router.get('/pedido/editar', function (req, res) {
    var pedidoId = req.query.entid;
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Pedido.findOne({_id: pedidoId}).populate(['endereco_entrega', 'cliente', 'entregador']).exec(function (err, pedido) {
        // TODO tratar o caso de nao achar o pedido
        Entregador.find({}, function (err, entregadores) {
            return res.render('editarPedido', {'pedido': pedido, 'entregadores': entregadores});
        });

    });
});

router.post('/pedido/editar', function (req, res) {
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

    Pedido.update(
        {_id: req.body.pedidoId},
        {
            nome_cliente:nome_cliente,
            endereco_entrega: endereco,
            entregador: id_entregador
        },
        {upsert: true}).exec(function (err) {
            return res.redirect('/empresa/pedidos');
        });
});

router.post('/pedido/excluir', function (req, res) {
    Pedido.findOne({
        _id: req.body.id_pedido
    }, function(err, pedido) {
        if (err) {
            return res.redirect('/empresa/dashboard', {message: "Ocorreu um erro interno"});
        }
        if (pedido) {
            Pedido.findByIdAndRemove(pedido._id).exec();
            Endereco.findByIdAndRemove(pedido.endereco_entrega).exec();
            return res.redirect('/empresa/pedidos');
        } else {
            // TODO mandar mensagem de erro caso n exista o pedido
        }
    });
});

router.post('/pedido/atualiza', function (req, res) {
    // TODO o que é isso ? lembre o que pedido tem 3 estados!!
    Pedido.update({_id: req.body.id_pedido},
        {status: 'EM ANDAMENTO'},
        {upsert: true}).exec(function (err) {
            if (err) {
                return res.redirect('/empresa/dashboard', {message: "Ocorreu um erro interno"});
            }
        });

    return res.redirect('/empresa/pedidos');
});

router.get('/relatorios', function (req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Entregador.find({empresa: req.user._id}).populate('usuario').exec(function (err, entregadores) {
        Pedido.find({empresa: req.user._id}).populate(['endereco_entrega', 'cliente', 'entregador']).exec(function (err, pedidos) {
            Pedido.populate(pedidos, {path: 'entregador.usuario', model: 'Usuario'}, function (err, pedidos) {
                //TODO Fazer enviar as quantidades por bairros e trabalhar com esse objeto no HTML.
                return res.render('pedidos', {'pedidos': pedidos, 'entregadores': entregadores});
            });
        });
    });
});

module.exports = router;