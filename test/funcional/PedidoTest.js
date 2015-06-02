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

describe('Pagina de Pedido', function(){
    afterEach(function(done){
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
    beforeEach(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });
        empresa.save(function(){
            // TODO LOGAR COM A EMPRESA
            done();
        })

    });
    it('Test GET /empresa/pedido', function(done){
        request(app)
            .get('/empresa/pedido')
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Registrar Pedido') > -1);
                done()
            });
    })
    it('Test POST /empresa/pedido', function(done){
        request(app)
            .post('/empresa/pedido')
            .send({
                'endereco' : 'Rua Siqueira Campos',
                'cidade' :'Campina Grande',
                'estado' :'Paraiba',
                'cliente' :'99880000',
                'entregador' : '77888990',
                'empresa_id' : '1203910293189238'
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


