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

var fields = {
    rua : 'Rua Siqueira Campos',
    numero : '333',
    bairro : 'Prata',
    cidade :'Campina Grande',
    estado :'Paraiba',
    nome_cliente : 'Ronaldo',
    telefone_cliente :'99880000',
    telefone_entregador : '99876534'
};

describe('Page Pedido Test', function(){
    afterEach(function(done){
        Empresa.remove(function(){
            Pedido.remove(function(){
                Usuario.remove(function(){
                    Endereco.remove(function(){
                        Entregador.remove(done);
                    });
                })
            })
        })
    });
    beforeEach(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });
        var usuario2 = new Usuario({
            nome: "Cliente",
            telefone: "99880000",
            codigoPais: "+55",
            regId: "APA91bFpJ9lHajNdf41Gi0KyfXtEHjvwo7ZUuvcGuRLI7C0t_or5KjoMQbXUjZ01gfV7Rqo5OfgjKlMQDaKoSB4DcTQ116ZsZULJ4KY6W99gn2-YwtlxQJc"
        });
        var usuario = new Usuario({
            nome: "Entregador",
            telefone: "99876534",
            codigoPais: "+55",
            regId: "aopdpaodspoajsdij1231ej1d09"
        });
        var entregador = new Entregador({
            usuario : usuario._id,
            empresa: empresa._id
        });
        empresa.save(function(){
            usuario.save(function(){
                entregador.save(function(){
                    usuario2.save(function(){
                        done();
                    });
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
    it('Test cadastrar pedido', function(done){
        agent
            .post('/empresa/pedido')
            .send(fields)
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('/empresa/dashboard') > -1);
                Pedido.find().populate(['entregador', 'usuario', 'endereco_entrega']).exec(function(err, pedidos){
                    Pedido.populate(pedidos, {path: 'entregador.usuario', model:'Usuario'}, function(err, pedidos) {
                        assert.equal(1, pedidos.length);
                        assert.equal('99880000', pedidos[0].usuario.telefone);
                        assert.equal('Prata', pedidos[0].endereco_entrega.bairro);
                        assert.equal('99876534', pedidos[0].entregador.usuario.telefone);
                        done();
                    });
                });
            });
    });

    it('Test cadastrar pedido sem entregador', function(done){
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
                telefone_entregador : ''
            })
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('/') > -1);
                Pedido.find().populate(['entregador']).exec(function(err, pedidos){
                    assert.equal(1, pedidos.length);
                    assert.equal(null, pedidos[0].entregador);
                    done();
                });
            });
    });

    it('Test cadastrar pedido cliente = entregador', function(done){
        agent
            .post('/empresa/pedido')
            .send({
                rua : 'Rua Siqueira Campos',
                numero : '333',
                bairro : 'Prata',
                cidade :'Campina Grande',
                estado :'Paraiba',
                nome_cliente : 'Ronaldo',
                telefone_cliente :'99876534',
                telefone_entregador : '99876534'
            })
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Registrar Pedido') > -1);
                Pedido.find({}, function(err, pedidos){
                    assert.equal(0, pedidos.length);
                    Usuario.find({}, function(err, usuarios) {
                        assert.equal(2, usuarios.length);
                        done();
                    });
                });
            });
    });

    it('Test deletar pedido', function(done){
        agent
            .post('/empresa/pedido')
            .send(fields)
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                Pedido.find({}, function(err, pedidos){
                    assert.equal(1, pedidos.length);
                    agent
                        .post('/empresa/pedido/excluir')
                        .send({
                            id_pedido : pedidos[0]._id
                        })
                        .expect(302)
                        .end(function(err, res){
                            if (err) throw err;
                            Pedido.find({}, function(err, pedidos){
                                assert.equal(0, pedidos.length);
                                Usuario.find({}, function(err, usuarios) {
                                    assert.equal(2, usuarios.length);
                                    Entregador.find({}, function(err, entregadores) {
                                        assert.equal(1, entregadores.length);
                                        Endereco.find({}, function(err, enderecos) {
                                            //assert.equal(0, enderecos.length);
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                });
            });
    });
});


