var express = require('express');
var router = express.Router();
var Empresa = require('../models/empresa');

router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    res.render('auth/register');
});

router.post('/', function(req, res){

    if (req.body.password != req.body.password_confirmation) {
        return res.render('auth/register', {message: "Senha não confere!"});
    } else if (req.body.email.trim() == "") {
        return res.render('auth/register', {message: "Email Requerido"});
    } else if (req.body.name.trim() == "") {
        return res.render('auth/register', {message: "Nome Requerido"});
    } else if (req.body.password.trim() == "") {
        return res.render('auth/register', {message: "Senha Requerida"});
    }else if (req.body.password.trim().length < 7) {
        return res.render('auth/register', {message: "Senha Deve Ter No Mínimo 7 Caracteres"});
    }
    Empresa.find({
        email: req.body.email
    },function(err, empresas){
        if (empresas.length > 0) {
            return res.render('auth/register', {message: "Email Já Cadastrado"});
        } else {
            var a = new Empresa({
                nome: req.body.name,
                img_path: req.body.image,
                email: req.body.email,
                senha: req.body.password
            });
            a.save(function(err, a){
                if(err) return res.send(500, 'Error occurred: database error.');
                res.redirect("/auth/login");
            });
        }
    });
});

module.exports = router;

