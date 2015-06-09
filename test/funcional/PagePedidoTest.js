var assert = require("assert");
var request = require('supertest');
var express = require('express');
var Empresa = require("../../models/empresa");
var Usuario = require("../../models/usuario");
var Entregador = require("../../models/entregador");
var Endereco = require("../../models/endereco");
var Pedido = require("../../models/pedido");

process.env.NODE_ENV = "TESTING";
var app = require('../../app');

var agent = request.agent(app);

describe('Page Pedido Test', function(){
    after(function(done){
        // remove todos os registros do bd
        Pedido.remove({}, function(){
            Usuario.remove({}, function(){
                Entregador.remove({}, function(){
                    Endereco.remove({}, function(){
                        Empresa.remove({}, function(){
                            done();
                        });
                    });
                });
            });
        });
    });
    before(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });
        empresa.save(function(){
            var usuario = new Usuario({
                name: "Entregador",
                phone: "99876534",
                countryCode: "+55",
                regId: "aopdpaodspoajsdij1231ej1d09"
            });
            usuario.save(function(){
                var entregador = new Entregador({
                    usuario : usuario._id,
                    empresa: empresa._id
                });
                entregador.save(function(){
                    done();
                });
            });
        })

    });

    beforeEach(function(done) {
        agent
            .post('/auth/login')
            .send({email : 'Day Trip', password : 'asdasdok'})
            .expect(302)
            .end(function(err, res){
                assert(res.text.indexOf('empresa/dashboard') > -1);
                done();
            });
    })

    afterEach(function(done) {
        agent
            .get('/empresa/logout')
            .expect(302)
            .end(function(err, res){
                assert(res.text.indexOf('auth/login') > -1);
                done()
            });
    });
    it('Test GET /empresa/pedido', function(done){
        agent
            .get('/empresa/pedido')
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Registrar Pedido') > -1);
                done()
            });
    })
    it('Test POST /empresa/pedido', function(done){
        agent
            .post('/empresa/pedido')
            .send({
                rua : 'Rua Siqueira Campos',
                numero : '333',
                bairro : 'Prata',
                cidade :'Campina Grande',
                estado :'Paraiba',
                nome_cliente : 'Ronaldo',
                telefone_cliente :'99880000',
                telefone_entregador : '99876534'
            })
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('/') > -1);
                Pedido.find(function(err, pedidos){
                    assert.equal(1, pedidos.length);
                    done();
                });
            });
    })
})


