var express = require('express');
var path = require('path');
var router = express.Router();
var Usuario = require('../models/usuario');
var Pedido = require('../models/pedido');
var Entregador = require('../models/entregador');
var gcm = require('../config/gcm-service');

router.post('/usuario/cadastro', function(req, res) {
    var a = new Usuario({
        nome_geeps: req.body.name,
        telefone: req.body.phone,
        codigoPais: req.body.countryCode,
        regId: req.body.regId
    });
    a.save(function(err, a) {
        if (err) return res.send(500, 'Error occurred: database error.');
        res.json({
            'message': 'usuario cadastrado com sucesso'
        });
    });
});

router.post('/usuario/check', function(req, res) {
    var telefone = req.body.phone;
    Usuario.find({
        telefone: telefone
    }, function(err, usuarios) {
        if (usuarios.length == 0) {
            res.json({
                'success': 'usuario nao cadastrado'
            });
        } else {
            res.json({
                '_id': usuarios[0]._id,
                'nome_geeps': usuarios[0].nome_geeps,
                'telefone': usuarios[0].telefone,
                'codigoPais': usuarios[0].codigoPais,
                'regId': usuarios[0].regId
            });
        }
    });
});

router.post('/usuario/pedidos', function(req, res) {
    var telefone = req.body.phone;
    Usuario.findOne({
        telefone: telefone
    }, function(err, usuario) {
        if (!usuario) {
            res.json({
                'error': 'telefone nao cadastrado'
            });
        } else {
            Pedido.find({
                cliente: usuario,
                deleted : false
            }).populate(['empresa']).exec(function(err, pedidos) {
                var arrayPedidos = [];
                for (var i = 0; i < pedidos.length; i++) {
                    var jsonObj = {};
                    jsonObj['id'] = pedidos[i]._id;
                    jsonObj['empresa_nome'] = pedidos[i].empresa.nome;
                    jsonObj['status'] = pedidos[i].status;
                    jsonObj['entregador_id'] = pedidos[i].entregador;
                    arrayPedidos.push(jsonObj);
                }
                return res.json(arrayPedidos);
            });
        }
    });
});

router.post('/usuario/pedidos_entregador', function(req, res) {
    var telefone = req.body.telefoneEntregador;
    Usuario.findOne({
        telefone: telefone
    }, function(err, usuario) {
        if (!usuario) {
            res.json({
                'error': 'telefone nao cadastrado'
            });
        } else {
            Entregador.find({
                usuario: usuario
            } , function(err, entregador) {
                if (!entregador) {
                    res.json({
                    'error': 'telefone nao cadastrado como entregador'
                    });
                } else {
                    Pedido.find({
                        entregador: entregador,
                        deleted : false
                    }).populate(['empresa']).exec(function(err, pedidos) {
                        var arrayPedidos = [];
                        for (var i = 0; i < pedidos.length; i++) {
                            var jsonObj = {};
                            jsonObj['id'] = pedidos[i]._id;
                            jsonObj['empresa_nome'] = pedidos[i].empresa.nome;
                            jsonObj['status'] = pedidos[i].status;
                            jsonObj['entregador_id'] = pedidos[i].entregador;
                            arrayPedidos.push(jsonObj);
                        }
                    return res.json(arrayPedidos);
                    });
                }
            });
        }
    });
});

router.get('/usuario/testgcm', function(req, res) {
    gcm.sendNotificacaoPedido(
        'APA91bFpJ9lHajNdf41Gi0KyfXtEHjvwo7ZUuvcGuRLI7C0t_or5KjoMQbXUjZ01gfV7Rqo5OfgjKlMQDaKoSB4DcTQ116ZsZULJ4KY6W99gn2-YwtlxQJc',
        'Bar Do Cuscuz',
        "REGISTRADO");
});


module.exports = router;
