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
    status: "EM ANDAMENTO",
    empresa: empresa._id,
    endereco_entrega : endereco._id,
    usuario: usuario._id,
    entregador: entregador._id
});

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

    it('Test cadastrar usuario', function(done){
        agent
            .post('/usuario/cadastro')
            .send({
                name : 'jonatas',
                phone : '3333',
                countryCode : '+51',
                regId : '129urh912h9dh12938hd1928h3d2h18983hd128h9'
            })
            .expect(200)
            .end(function(err, res){
                assert.equal(JSON.parse(res.text).message, "usuario cadastrado com sucesso");
                Usuario.findOne({
                    telefone : '3333'
                }, function(err, usuario) {
                    assert.equal(usuario.regId, '129urh912h9dh12938hd1928h3d2h18983hd128h9');
                    done();
                });
            });
    });

    it('Test verificar se usuario ja existe', function(done){
        agent
            .post('/usuario/check')
            .send({
                telefone : '99876534'
            })
            .expect(200)
            .end(function(err, res){
                assert.equal(JSON.parse(res.text).success, "usuario nao cadastrado");
                done();
            });
    });

    it('Test pegar os pedidos de certo usuário', function(done){
        agent
            .post('/usuario/pedidos')
            .send({phone : '99876534'})
            .expect(200)
            .end(function(err, res){
                assert.equal(JSON.parse(res.text)[0].empresa_nome, "bar teste");
                assert.equal(JSON.parse(res.text)[0].status, "EM ANDAMENTO");
                assert.equal(JSON.parse(res.text)[0].entregador_id, entregador._id);
                done();
            });
    });
});


