var assert = require("assert");
var Empresa = require("../../models/empresa");
var Endereco = require("../../models/endereco");
var mongoose = require("mongoose");

describe('Endereco TEST', function(){

    beforeEach(function(done){
        // cria uma empresa
        Endereco.create({
            rua : "Rua Joao Lira",
            bairro : "Bela Vista",
            numero : "448",
            cidade : "Campina Grande",
            estado : "Paraiba",
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        Empresa.remove(function(){
            Endereco.remove(done);
        })
    })

    describe('TESTA CRIACAO DE UM ENDERECO' , function(){
        it('Precisa existir um endereco  no BD', function(done){
            Endereco.find(function(err, enderecos){
                assert.equal(1, enderecos.length);
                done();
            });
        })
    });
})
