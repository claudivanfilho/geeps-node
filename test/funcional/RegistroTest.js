var assert = require("assert");
var request = require('supertest');
var express = require('express');
var Empresa = require("../../models/empresa");

process.env.NODE_ENV = "TESTING";
var app = require('../../app');

describe('Pagina de Registro', function(){
    afterEach(function(done){
        // remove todos os registros do bd
        Empresa.remove({}, function(){
            done();
        });
    })
    it('Test GET /auth/register', function(done){
        request(app)
            .get('/auth/register')
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Registrar') > -1);
                done()
            });
    })
    it('Test POST /auth/register', function(done){
        request(app)
            .post('/auth/register')
            .send({
                'name' : 'BAR DO ZE',
                'email' :'barzin@gmail.com',
                'password' :'zezin123',
                'password_confirmation' :'zezin123'
            })
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('auth/login') > -1);
                Empresa.find(function(err, empresas){
                    assert.equal(1, empresas.length);
                    done();
                });
            });
    })
})


