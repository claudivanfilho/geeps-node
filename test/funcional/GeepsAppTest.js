var assert = require("assert");
var request = require('supertest');
var express = require('express');
var Empresa = require("../../models/empresa");
var Usuario = require("../../models/usuario");
var Entregador = require("../../models/entregador");
var Endereco = require("../../models/endereco");
var Pedido = require("../../models/pedido");
var mongoose = require('mongoose');

process.env.NODE_ENV = "TESTING";
var app = require('../../app');

var agent = request.agent(app);

describe('Geeps Routes Test', function(){
    after(function(done){
        Empresa.remove(function(){
            Pedido.remove(function(){
                Usuario.remove(function(){
                    Entregador.remove(done)
                })
            })
        })
    });
    before(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });
        var endereco = new Endereco({
            rua : "Rua Joao Lira",
            bairro : "Bela Vista",
            numero : "448",
            cidade : "Campina Grande",
            estado : "Paraiba"
        });

        var usuario = new Usuario({
            nome: "Joao",
            telefone: "99876534",
            codigoPais: "51",
            regId: "aopdpaodspoajsdij1231ej1d09"
        });
        var usuario2 = new Usuario({
            nome: "Jonas",
            telefone: "99876534",
            codigoPais: "51",
            regId: "aopdpaodspoajsdij1231ej1d09"
        });
        var entregador = new Entregador({
            usuario : usuario2._id,
            empresa: empresa._id
        });
        var pedido = new Pedido({
            status: "ANDAMENTO",
            empresa: empresa._id,
            endereco_entrega : endereco._id,
            usuario: usuario._id,
            entregador: entregador._id
        });

        empresa.save(function(err){
            endereco.save(function(err) {
                usuario.save(function(){
                    usuario2.save(function(){
                        entregador.save(function(){
                            pedido.save(function(){
                                done();
                            });
                        });
                    });
                });
            });
        });
    });


    it('Test POST /usuario/pedidos', function(done){
        agent
            .post('/usuario/pedidos')
            .send({phone : '99876534'})
            .expect(200)
            .end(function(err, res){
                assert.equal(JSON.parse(res.text)[0].empresa.nome, "bar teste");
                done();
            });
    });
});


