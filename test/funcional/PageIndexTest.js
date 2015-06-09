var assert = require("assert");
var request = require('supertest');
var express = require('express');

process.env.NODE_ENV = "TESTING";
var app = require('../../app');

describe('Home Page Test', function(){
    it('GET /', function(done){
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                assert(res.text.indexOf('Geeps') > -1);
                assert(res.text.indexOf('Sobre') > -1);
                assert(res.text.indexOf('Suporte') > -1);
                done()
            });
    })
})

