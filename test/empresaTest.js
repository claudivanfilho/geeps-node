var assert = require("assert");
var Empresa = require("../models/empresa");
var mongoose = require("mongoose");
db = mongoose.connect('mongodb://localhost/geeps_test');

/**
 * OBSERVAÇÃo: como o node trabalha de forma assynchrona, então é necessária a chamada dessa
 * função done() para indicar que precisa esperar por algum processo.
 *
 * para rodar os test basta ir na prompt e digitar ->  $> mocha
 */

describe('Empresa TEST', function(){

    beforeEach(function(done){
        // cria uma empresa
        Empresa.create({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        // remove todos os registros do bd
        Empresa.remove({}, function(){
            done();
        });
    })

    describe('TESTA CRIACAO DA EMPRESA' , function(){
        it('Precisa existir uma empresa no BD', function(done){
            Empresa.find(function(err, empresas){
                assert.equal(1, empresas.length);
                done();
            });
        })
    });
})