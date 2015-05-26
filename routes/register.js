var express = require('express');
var path = require('path');
var router = express.Router();
var Empresa = require('../models/empresa');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../views/auth/register.html'));
});

router.post('/', function(req, res){
    if (req.body.password != req.body.password_confirmation) {
        return res.send(500, "Senha não confere!");
    } else if (req.body.email.trim() == "") {
        return res.send(500, "Email Requerido");
    } else if (req.body.name.trim() == "") {
        return res.send(500, "Nome Requerido");
    } else if (req.body.password.trim() == "") {
        return res.send(500, "Senha Requerida");
    }else if (req.body.password.trim().length < 7) {
        return res.send(500, "Senha Deve Ter No Mínimo 7 Caracteres");
    }
    Empresa.find({
        email: req.body.email
    },function(err, empresas){
        if (empresas.length > 0) {
            return res.send(500, "Email Já Cadastrado");
        } else {
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
        }
    });
});

module.exports = router;

