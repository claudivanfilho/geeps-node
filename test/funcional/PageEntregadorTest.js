var assert = require("assert");
var request = require('supertest');
var express = require('express');
var Empresa = require("../../models/empresa");
var Entregador = require("../../models/entregador");
var Usuario = require("../../models/usuario");
var mongoose = require('mongoose');

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
        empresa.save(done);
    });

    after(function(done){
        Empresa.remove(function(){
            Usuario.remove(function(){
                Entregador.remove(done);
            })
        })
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
    it('Test page de cadastro do entregador', function(done){
        agent
            .get('/empresa/entregador')
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Nome do Entregador') > -1);
                done()
            });
    })
    it('Test cadastrar entregador', function(done){
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
    it('Test editar entregador', function(done){
        Entregador.findOne(function(err, entregador) {
            agent
                .post('/empresa/entregador/editar')
                .send({
                    'id_entregador' : entregador._id,
                    'nome_entregador' : 'JOSE',
                    'telefone_entregador' :'99997777'
                })
                .expect(302)
                .end(function(err, res){
                    if (err) throw err;
                    assert(res.text.indexOf('empresa/entregadores') > -1);
                    Entregador.find(function(err, entregadores){
                        assert.equal(1, entregadores.length);
                        assert.equal('JOSE', entregadores[0].nome);
                        done();
                    });
                });
        })
    })

    it('Test deletar entregador', function(done){
        Entregador.findOne(function(err, entregador) {
            agent
                .post('/empresa/entregador/excluir')
                .send({
                    'id_entregador' : entregador._id
                })
                .expect(302)
                .end(function(err, res){
                    if (err) throw err;
                    assert(res.text.indexOf('empresa/entregadores') > -1);
                    Entregador.find(function(err, entregadores){
                        assert.equal(0, entregadores.length);
                        done();
                    });
                });
        });
    })

    it('Test deletar entregador com pedidos', function(done){
        // TODO criar teste
        // deve deletar somente o entregador, deixa os pedidos intactos
        // e o usuario referente ao entregador intacto tb
        done();
    })

    it('Test cadastrar entregador em mais de uma empresa', function(done){
        // TODO criar teste
        done();
    })

    it('Test deletar entregador que pertence a mais de uma empresa', function(done){
        // TODO criar teste
        // so deve ser deletado o entregador de determinada empresa
        done();
    })

    it('Test cadastrar entregador que ja seja usuario do sistema', function(done){
        // TODO criar teste
        done();
    })
})


