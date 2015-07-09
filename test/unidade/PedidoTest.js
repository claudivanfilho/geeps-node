var assert = require("assert");
var Pedido = require("../../models/pedido");

describe('Pedido TEST', function(){

    beforeEach(function(done){
        Pedido.create({
            status : "EM ANDAMENTO"
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        Pedido.remove(done);
    })

    describe('TESTA CRIACAO DE UM Pedido' , function(){
        it('Precisa existir um endereco  no BD', function(done){
            Pedido.find(function(err, pedidos){
                assert.equal(1, pedidos.length);
                done();
            });
        })
    });
})
