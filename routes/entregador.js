var express = require('express');
var router = express.Router();
var path = require('path');
var Empresa = require('../models/empresa');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");

router.post('/entregador', function(req, res){
    var nome_entregador = req.body.nome_entregador;
    var num_entregador = req.body.telefone_entregador;

    if(nome_entregador === undefined || nome_entregador.trim() == ""){
        return res.status(500).send("Nome do Entregador Requerido");
    } else if (num_entregador === undefined || num_entregador.trim() == "") {
        return res.status(500).send("Número do Entregador Requerido");
    } 
    Usuario.find({
        telefone: num_entregador
    },function(err, usuarios){
        var user;
        if (usuarios.length == 0) {
            // cria um novo Usuario do sistema (Entregador também é usuário)
            user = new Usuario({
                telefone : num_entregador,
                nome_geeps: nome_entregador
            });
            user.save(function(){
                var entregador = new Entregador({
                    nome : nome_entregador,
                    usuario : user._id,
                    empresa: req.user._id
                })
                entregador.save(function(){
                    return res.status(200).send("Entregador cadastrada com sucesso.");
                });
            });
        } else {
            user = usuarios[0];

            Entregador.find({empresa: req.user._id, usuario: user._id}, function (err, entregadores) {
                // Verifica se o telefone passado já consta no banco de entregadores para determinada empresa
                if(entregadores.length == 0){
                    var entregador = new Entregador({
                        nome : nome_entregador,
                        usuario : user._id,
                        empresa: req.user._id
                    })
                    entregador.save(function(){
                        return res.status(200).send("Entregador cadastrada com sucesso.");
                    });
                } else {
                    return res.status(200).send("Entregador cadastrada com sucesso.");
                }
            });
        }
    });
});

router.post('/entregador/editar', function(req, res){
    var nome_entregador = req.body.nome_entregador;
    var telefone_entregador = req.body.telefone_entregador;
    var id_entregador = req.body.id_entregador;
    var id_usuario = req.body.id_usuario;

    Entregador.update({_id: id_entregador},
        {nome: nome_entregador},
        {upsert: true}).exec(function(err){
            if (err) {
                return res.status(500).send("Ocorreu um erro interno");
            } else {
                // TODO VERIFICAR SE O TELEFONE FORNECIDO JA ESTA CADASTRADO PARA UM USUARIO
                Usuario.update({_id: id_usuario},
                    {telefone: telefone_entregador},
                    {upsert: true}).exec(function(err){
                        if (err) {
                            return res.status(500).send("Ocorreu um erro interno");
                        } else {
                            return res.status(200).send("Entregador editado com sucesso!");
                        }
                    });
            }
        });
    //TODO testar
});

router.post('/entregador/excluir', function(req, res){
    Entregador.remove({_id:req.body.id_entregador}, function(err){
        if(err){
            return res.status(500).send("Ocorreu um erro interno");
        } else {
            return res.status(200).send("Entregador excluído com sucesso!");
        }
    });

});

module.exports = router;
