var express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs-extra');
var router = express.Router();
var Empresa = require('../models/empresa');
var Endereco = require('../models/endereco');

router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    res.render('auth/register');
});

checkDataPost = function(req, res) {
    if (req.name.trim() == "") {
        return res.render('auth/register', {
            message: "Nome Requerido"
        });
    } else if (req.password.trim() != req.password_confirmation.trim()) {
        return res.render('auth/register', {
            message: "Senha não confere!"
        });
    } else if (req.email.trim() == "") {
        return res.render('auth/register', {
            message: "Email Requerido"
        });
    } else if (req.password.trim() == "") {
        return res.render('auth/register', {
            message: "Senha Requerida"
        });
    } else if (req.password.trim().length < 7) {
        return res.render('auth/register', {
            message: "Senha Deve Ter No Mínimo 7 Caracteres"
        });
    }
    return true;
}

saveEmpresa = function(fields, files, res) {
    var empresa = new Empresa({
        nome: fields.name,
        imgPath: '/uploads/' + fields.email + '/' + files.image.name,
        email: fields.email,
        senha: fields.password
    });

    empresa.save(function(err) {
        if (err) {
            return res.render("auth/register", {
                message: "Ocorreu um erro interno. Tente novamente."
            });
        }

        var endereco = new Endereco({
            rua: fields.street,
            bairro: fields.neighborhood,
            numero: fields.num,
            cidade: fields.city,
            estado: fields.state
        });

        endereco.save(function(err) {
            if (err) {
                return res.render("auth/register", {
                    message: "Ocorreu um erro interno. Tente novamente."
                });
            } else {
                empresa.endereco = endereco._id;
                empresa.save(function() {
                    return res.render('auth/login', {
                        success: "Empresa cadastrada com sucesso."
                    });
                });
            }
        });
    });
}

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.render('auth/register', {
                message: "Empresa Já Cadastrada"
            });
        } else {
            if (checkDataPost(fields, res)) {
                fs.readFile(files.image.path, function(err, data) {
                    if (!files.image.name || !fields.email) {
                        res.redirect("/");
                        res.end();
                    } else {
                        Empresa.findOne({
                            email: fields.email
                        }).exec(function(err, empresa) {
                            if (!empresa) {
                                var newLocation = __dirname + '/../public/uploads/' + fields.email + '/' + files.image.name;
                                fs.copy(files.image.path, newLocation, function(err) {
                                    if (err) {
                                        return res.render("/auth/register", {
                                            message: "Ocorreu um erro interno. Tente novamente."
                                        });
                                    } else {
                                        saveEmpresa(fields, files, res);
                                    }
                                });
                            } else {
                                console.log("EMPRESA Já cadastrada");
                                return res.render("auth/register", {
                                    message: "Empresa já cadastrada."
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;
