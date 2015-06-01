var assert = require("assert");
var Pedido = require("../../models/pedido");
var mongoose = require("mongoose");

/**
 * OBSERVAÇÃo: como o node trabalha de forma assynchrona, então é necessária a chamada dessa
 * função done() para indicar que precisa esperar por algum processo.
 *
 * para rodar os test basta ir na prompt e digitar ->  $> mocha
 */

describe('Pedido TEST', function(){

    beforeEach(function(done){

        // cria uma empresa
        Pedido.create({
            status : "EM ANDAMENTO"
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        // remove todos os registros do bd
        Pedido.remove({}, function(){
            done();
        });
    })

    describe('TESTA CRIACAO DE UM Pedido' , function(){
        it('Precisa existir um endereco  no BD', function(done){
            Pedido.find(function(err, pedidos){
                //assert.equal(1, pedidos.length);
                done();
            });
        })
    });
})
