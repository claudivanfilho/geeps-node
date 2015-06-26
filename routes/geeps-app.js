var express = require('express');
var path = require('path');
var router = express.Router();
var Usuario = require('../models/usuario');

var gcm = require('node-gcm');
// TODO Set up the sender with you API key
//var sender = new gcm.Sender('AIzaSyB_UfPKopXTwPSryspKHuowjLkWpuo5M-w');
var sender = new gcm.Sender('AIzaSyBpRXYncUHxPTJJo0pqblKWZUOCdAzSyVA');

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
            res.json({'error' : 'usuario inexistente'});
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
    var message = new gcm.Message();
    message.addData('TESTE', 'MiNHA MENSAGEM');

    var regId = 'APA91bGV7CAO8o1wvBoPcMIdOy-1YpI4_B_WG2yHsC32otUXNZjJe7opUmeQf6h9LzeKtG0Jdo7fngvINdrF99lkwTPykEUtEtWOjKiMqbgsHqi4P27m66lBcUSoJFJ5nLawfxViejJl';

    sender.send(message, regId, function (err, result) {
        if(err) console.error(err);
        else    console.log(result);
    });
});


module.exports = router;