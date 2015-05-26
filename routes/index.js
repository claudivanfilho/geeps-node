var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var Empresa = require('../models/empresa');
var Usuario = require('../models/usuario');

var rest = require('connect-rest');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/auth/login', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../views/auth/login.html'));
});

router.post('/auth/login', function(req, res, next) {
    mongoose.model('Empresa').findOne({email:req.body.email}, function(err,empresa){
        if(!err){
            if(empresa != null){
                if(empresa.senha == req.body.password){
                    console.log("Ok.");
                }else {
                    console.log("Senha incorreta.");
                }
            }else{
                console.log("Usuario não existe.");
            }
            
        }else{
            console.log("Erro no banco de dados.");
        }
    });
});

router.get('/auth/register', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../views/auth/register.html'));
});

router.get('/empresas', function(req, res, next) {
    mongoose.model('Empresa').find(function(err, empresas) {
        res.send(empresas);
    })
});

router.get('/usuarios', function(req, res, next) {
    mongoose.model('Usuario').find(function(err, usuarios) {
        res.send(usuarios);
    })
});

router.post('/usuario/cadastro', function(req, res){
    var a = new Usuario({
        name: req.body.name,
        phone: req.body.phone,
        countryCode: req.body.countryCode,
        regId: req.body.regId
    });
    a.save(function(err, a){
        if(err) return res.send(500, 'Error occurred: database error.');
        res.json({'message' : 'usuario cadastrado com sucesso'});
    });
});

router.post('/empresa/cadastro', function(req, res){
    console.log(req.body.name);
    var a = new Empresa({
        nome: req.body.name,
        img_path: req.body.image,
        email: req.body.email,
        senha: req.body.password
    });
    a.save(function(err, a){
        if(err) return res.send(500, 'Error occurred: database error.');
        res.json({'message' : 'Empresa cadastrada com sucesso'});
    });
});

router.post('/check_user', function(req, res){
    var telefone = req.body.phone;
    Usuario.find({
        phone: telefone
    },function(err, usuarios){
        if (usuarios.length == 0) {
            res.json({'answer': 'false'});
        } else {
            res.json({'answer': 'true'});
        }
    });
});

router.post('/get_user', function(req, res){
    var telefone = req.body.phone;
    Usuario.find({
        phone: telefone
    },function(err, usuarios){
        if (usuarios.length == 0) {
            res.json({'error' : 'usuario inexistente'});
        } else {
            res.json({
              '_id': usuarios[0]._id,
              'name': usuarios[0].name,
              'phone': usuarios[0].phone,
              'countryCode': usuarios[0].countryCode,
              'regId': usuarios[0].regId,
            });
        }
    });
});

module.exports = router;
