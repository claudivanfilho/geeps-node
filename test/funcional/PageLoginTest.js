var Empresa, mongoose, request, should, empresa, agent, app, express;

express = require('express');
assert = require("assert");
mongoose = require("mongoose");
Empresa     = mongoose.model("Empresa");
request  = require("supertest");

process.env.NODE_ENV = "TESTING";
var app = require('../../app');

var agent = request.agent(app);

describe('Page Login Test', function () {
    before(function(done) {
        empresa = new Empresa({
            nome: "Empresa nome",
            email: "email@email.com",
            senha: "senha123"
        });
        empresa.save(done)
    });

    after(function(done) {
        Empresa.remove().exec(done);
    });

    beforeEach(function(done) {
        agent
            .post('/auth/login')
            .send({email : 'email@email.com', password : 'senha123'})
            .expect(302)
            .end(function(err, res){
                assert(res.text.indexOf('empresa/dashboard') > -1);
                done();
            });
    });

    afterEach(function(done) {
        agent
            .get('/empresa/logout')
            .expect(302)
            .end(function(err, res){
                assert(res.text.indexOf('auth/login') > -1);
                done()
            });
    });

    it('Testa Logar e LogOut', function (done) {
        done();
    })

    it('Testa Logar e redirecinar para empresa/dashboard', function (done) {
        agent
            .post('/auth/login')
            .send({email : 'email@email.com', password : 'senha123'})
            .expect(302)
            .end(function(err, res){
                assert(res.text.indexOf('empresa/dashboard') > -1);
                agent
                    .get('/')
                    .expect(302)
                    .end(function(err, res){
                        assert(res.text.indexOf('empresa/dashboard') > -1);
                        agent
                            .get('/empresa/logout')
                            .expect(302)
                            .end(function(err, res){
                                assert(res.text.indexOf('auth/login') > -1);
                                done()
                            });
                    });

            });
    })

    it('Test logar com campos invalidos', function(done){
        // TODO criar test
        done();
    });
})