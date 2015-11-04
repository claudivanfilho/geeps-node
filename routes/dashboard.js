var express = require('express');
var router = express.Router();
var path = require('path');
var Empresa = require('../models/empresa');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");
var Endereco = require("../models/endereco");
var Pedido = require("../models/pedido");

router.get('/dashboard', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    if (req.user.inativa) {
        return res.sendFile(path.join(__dirname+'/../public/templates/layouts/baseInative.html'));
    }
    return res.sendFile(path.join(__dirname+'/../public/templates/layouts/base.html'));
});

router.get('/relatorios', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    if (req.user.inativa) {
        return res.sendFile(path.join(__dirname+'/../public/templates/layouts/baseInative.html'));
    }
    Empresa.findById(req.user._id, function(err, empresa) {
        if (empresa.stripe.plan == 'basic') {
            return res.redirect('/');
        } else {
            return res.sendFile(path.join(__dirname+'/../public/templates/layouts/base.html'));
        }
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out!";
});

router.post('/editar', function(req, res) {
    if (!req.user) {
        return res.redirect('/auth/login');
    } else {
        var id_endereco = req.body.id_endereco;

        if (req.body.empresa != undefined) {
            Empresa.update({
                _id : req.user._id
            }, req.body.empresa, { // req.body.empresa eh um json vindo do angular
                upsert: true
            }).exec(function(err) {
                if (err)
                    return res.status(500).send("Ocorreu um erro interno.");
            });
        }

        if (req.body.endereco != undefined) {
            Endereco.update({
                _id: id_endereco
            }, req.body.endereco, {
                upsert: true
            }).exec(function (err) {
                if (err)
                    return res.status(500).send("Ocorreu um erro interno.");
            });
        }
        return res.status(200).send("Atualização concluída com sucesso.")
    }
});

/**
 *  Primeiro a empresa tem seu plano cancelado no stripe, depois os campos de inativa e stripe.plan são atualizados.
 *  E por final a empresa é deslogada e então é retornada uma mensagem para o cliente.
 */
router.post('/excluir', function(req, res) {
    if (!req.user) {
        return res.redirect('/auth/login');
    } else {
        Empresa.findById(req.user._id, function(err, empresa) {
            empresa.cancelStripe(function(err) {
                if (err)
                    return res.status(500).send("Ocorreu um erro ao tentar cancelar o plano");
                Empresa.update({
                    _id : req.user._id
                }, {
                    inativa : true,
                    stripe : {
                        plan : null
                    }
                }, {
                    upsert: true
                }).exec(function(err) {
                    if (err)
                        return res.status(500).send("Ocorreu um erro interno.");
                    req.logout();
                    req.session.notice = "You have successfully been logged out!";
                    return res.status(200).send("Sua conta foi desativada com sucesso.");
                });
            })
        });

    }
});

router.get('/*', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    if (req.user.inativa) {
        return res.sendFile(path.join(__dirname+'/../public/templates/layouts/baseInative.html'));
    } else {
        return res.sendFile(path.join(__dirname+'/../public/templates/layouts/base.html'));
    }
});

module.exports = router;
