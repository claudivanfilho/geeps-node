var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs-extra');
var Empresa = require('../models/empresa');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");

router.get('/dashboard', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../public/templates/layouts/base.html'));
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out!";
});

router.get('/perfil', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    Empresa.findOne({
        email: req.user.email
    }).populate('endereco').exec(function(err, empresa) {
        return res.render('empresa/perfil', {
            'empresa': empresa
        });

    });
});

router.post('/perfil/editar', function(req, res) {
    if (!req.user) {
        return res.redirect('/auth/login');
    } else {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            if (files.image.name) {
                fs.readFile(files.image.path, function(err, data) {
                    var email = req.user.email;
                    var newLocation = __dirname + '/../public/uploads/' + email + '/' + files.image.name;
                    fs.copy(files.image.path, newLocation, function(err) {
                        if (err) {
                            res.redirect("/", {
                                message: "Ocorreu um erro interno. Tente novamente."
                            });
                        } else {
                            updateEmpresa(fields, files, res, email);
                        }
                    });
                });
            } else {
                var email = req.user.email;
                updateEmpresaSemImagem(fields, files, res, email);
            }
        });
    }
});

router.get('/*', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../public/templates/layouts/base.html'));
});

updateEmpresa = function(fields, files, res, email) {
    var endereco = new Endereco({
        rua: fields.rua,
        bairro: fields.bairro,
        numero: fields.numero,
        cidade: fields.cidade,
        estado: fields.estado
    });

    endereco.save(function(err) {
        if (err) {
            return res.render("auth/register", {
                message: "Ocorreu um erro interno. Tente novamente."
            });
        } else {
            Empresa.findOne({
                email: email
            }).exec(function(err, empresa) {
                Empresa.update({
                    _id: empresa._id
                }, {
                    nome: fields.nome,
                    imgPath: '/uploads/' + email + '/' + files.image.name,
                    email: email,
                    endereco: endereco._id,
                }, {
                    upsert: true
                }).exec(function(err) {
                    return res.redirect('/empresa/dashboard');
                });
            });
        }
    });
}

updateEmpresaSemImagem = function(fields, files, res, email) {
    var endereco = new Endereco({
        rua: fields.rua,
        bairro: fields.bairro,
        numero: fields.numero,
        cidade: fields.cidade,
        estado: fields.estado
    });

    endereco.save(function(err) {
        if (err) {
            return res.render("auth/register", {
                message: "Ocorreu um erro interno. Tente novamente."
            });
        } else {
            Empresa.findOne({
                email: email
            }).exec(function(err, empresa) {
                Empresa.update({
                    _id: empresa._id
                }, {
                    nome: fields.nome,
                    email: fields.email,
                    endereco: endereco._id,
                }, {
                    upsert: true
                }).exec(function(err) {
                    return res.redirect('/empresa/dashboard');
                });
            });
        }
    });
}

module.exports = router;
