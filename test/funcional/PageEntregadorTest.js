var assert = require("assert");
var request = require('supertest');
var express = require('express');
var Empresa = require("../../models/empresa");
var Entregador = require("../../models/entregador");
var Usuario = require("../../models/usuario");

process.env.NODE_ENV = "TESTING";
var app = require('../../app');

var agent = request.agent(app);

describe('Entregador Page Test', function(){
    before(function(done) {
        empresa = new Empresa({
            nome: "Empresa nome",
            email: "email@email.com",
            senha: "senha123"
        });
        empresa.save(done)
    });

    after(function(done){
        // remove todos os registros do bd
        Empresa.remove({}, function(){
            Entregador.remove({}, function(){
                Usuario.remove({}, function(){
                    done();
                });
            });
        });
    })

    beforeEach(function(done) {
        agent
            .post('/auth/login')
            .send({email : 'email@email.com', password : 'senha123'})
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
    it('Test GET /empresa/entregador', function(done){
        agent
            .get('/empresa/entregador')
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Nome do Entregador') > -1);
                done()
            });
    })
    it('Test POST /empresa/entregador', function(done){
        agent
            .post('/empresa/entregador')
            .send({
                'nome_entregador' : 'JOAO',
                'telefone_entregador' :'99997777'
            })
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('empresa/dashboard') > -1);
                Entregador.find(function(err, entregadores){
                    assert.equal(1, entregadores.length);
                    done();
                });
            });
    })
})


