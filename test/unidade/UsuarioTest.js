var assert = require("assert");
var Usuario = require("../../models/usuario");
var mongoose = require("mongoose");

describe('Usuario TEST', function(){

    beforeEach(function(done){
        // cria um usuario
        Usuario.create({
            name: "Joao",
            phone: "99876534",
            countryCode: "51",
            regId: "aopdpaodspoajsdij1231ej1d09"
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        Usuario.remove(done);
    })

    describe('TESTA CRIACAO DO USUARIO' , function(){
        it('Precisa existir uma usuario no BD', function(done){
            Usuario.find(function(err, usuarios){
                assert.equal(1, usuarios.length);
                done();
            });
        })
    });

    describe('TESTA EXISTE USUARIO COM DADO TELEFONE' , function(){
        it('Precisa existir uma usuario com o dado telefone no BD', function(done){
            Usuario.find({
                phone: "99876534"
            },function(err, usuarios){
                assert.equal(1, usuarios.length);
                done();
            });
        })
    });

    describe('TESTA SE NÃO EXISTE USUARIO COM DADO TELEFONE' , function(){
        it('Não deve existir uma usuario com o dado telefone no BD', function(done){
            Usuario.find({
                phone: "4"
            },function(err, usuarios){
                assert.equal(0, usuarios.length);
                done();
            });
        })
    });
})