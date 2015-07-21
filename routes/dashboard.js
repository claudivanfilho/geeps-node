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

    Empresa.findOne({
        email: req.user.email
    }).populate('pedidos').exec(function(err, empresa) {
        Pedido.find({
            empresa: req.user._id
        }).populate(['endereco_entrega', 'cliente', 'entregador']).exec(function(err, pedidos) {
            Pedido.populate(pedidos, {
                path: 'entregador.usuario',
                model: 'Usuario'
            }, function(err, pedidos) {
                Entregador.find({
                    empresa: empresa._id
                }).populate('usuario').exec(function(err, entregadores) {
                    return res.render('dashboard', {
                        'empresa': empresa,
                        'entregadores': entregadores,
                        'pedidos': pedidos
                    });
                });
            });
        });
    });
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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (files.image.name) {
            fs.readFile(files.image.path, function(err, data) {
                var newLocation = __dirname + '/../public/uploads/' + fields.email + '/' + files.image.name;
                fs.copy(files.image.path, newLocation, function(err) {
                    if (err) {
                        res.redirect("/", {
                            message: "Ocorreu um erro interno. Tente novamente."
                        });
                    } else {
                        updateEmpresa(fields, files, res);
                    }
                });
            });
        } else {
            updateEmpresaSemImagem(fields, files, res);
        }
    });
});

updateEmpresa = function(fields, files, res) {
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
                email: fields.email
            }).exec(function(err, empresa) {
                Empresa.update({
                    _id: empresa._id
                }, {
                    nome: fields.nome,
                    imgPath: '/uploads/' + fields.email + '/' + files.image.name,
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

updateEmpresaSemImagem = function(fields, files, res) {
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
                email: fields.email
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
