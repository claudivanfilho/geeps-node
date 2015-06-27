var express = require('express');
var path = require('path');
var router = express.Router();
var Usuario = require('../models/usuario');
var gcm = require('../config/gcm-service');

router.post('/cadastro', function(req, res){
    var a = new Usuario({
        nome: req.body.name,
        telefone: req.body.phone,
        codigoPais: req.body.countryCode,
        regId: req.body.regId
    });
    a.save(function(err, a){
        if(err) return res.send(500, 'Error occurred: database error.');
        res.json({'message' : 'usuario cadastrado com sucesso'});
    });
});

router.post('/check', function(req, res){
    var telefone = req.body.phone;
    Usuario.find({
        telefone: telefone
    },function(err, usuarios){
        if (usuarios.length == 0) {
            res.json({'success' : 'usuario nao cadastrado'});
        } else {
            res.json({
                '_id': usuarios[0]._id,
                'nome': usuarios[0].name,
                'telefone': usuarios[0].phone,
                'codigoPais': usuarios[0].countryCode,
                'regId': usuarios[0].regId
            });
        }
    });
});

router.get('/testgcm', function(req, res) {
    gcm.sendNotificacaoPedido(
        'APA91bFpJ9lHajNdf41Gi0KyfXtEHjvwo7ZUuvcGuRLI7C0t_or5KjoMQbXUjZ01gfV7Rqo5OfgjKlMQDaKoSB4DcTQ116ZsZULJ4KY6W99gn2-YwtlxQJc',
        'Bar Do Cuscuz',
        "REGISTRADO");
});


module.exports = router;