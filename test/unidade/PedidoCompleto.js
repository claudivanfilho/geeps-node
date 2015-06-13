var assert = require("assert");
var Empresa = require("../../models/empresa");
var Usuario = require("../../models/usuario");
var Entregador = require("../../models/entregador");
var Endereco = require("../../models/endereco");
var Pedido = require("../../models/pedido");
var mongoose = require("mongoose");

/**
 * OBSERVAÇÃo: como o node trabalha de forma assynchrona, então é necessária a chamada dessa
 * função done() para indicar que precisa esperar por algum processo.
 *
 * para rodar os test basta ir na prompt e digitar ->  $> mocha
 */

describe('Pedido COMPLETO TEST', function(){

    beforeEach(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });

        empresa.save(function(err){
            var endereco = new Endereco({
                rua : "Rua Joao Lira",
                bairro : "Bela Vista",
                numero : "448",
                cidade : "Campina Grande",
                estado : "Paraiba"
            });
            endereco.save(function(err) {
                var usuario = new Usuario({
                    nome: "Joao",
                    telefone: "99876534",
                    codigoPais: "51",
                    regId: "aopdpaodspoajsdij1231ej1d09"
                });
                var usuario2 = new Usuario({
                    nome: "Jonas",
                    telefone: "99876534",
                    codigoPais: "51",
                    regId: "aopdpaodspoajsdij1231ej1d09"
                });
                var entregador = new Entregador({
                    usuario : usuario2._id,
                    empresa: empresa._id
                });
                usuario.save(function(){
                    usuario2.save(function(){
                        entregador.save(function(){
                            var pedido = new Pedido({
                                status: "ANDAMENTO",
                                empresa: empresa._id,
                                endereco_entrega : endereco._id,
                                usuario: usuario._id,
                                entregador: entregador._id
                            });
                            pedido.save(function(){
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    afterEach(function(done){
        Pedido.remove(function(){
            Empresa.remove(function(){
                Endereco.remove(function(){
                    Usuario.remove(function(){
                        Entregador.remove(done)
                    })
                })
            })
        });
    });

    describe('TESTA CRIACAO DE UM Pedido' , function(){
        it('Precisa existir um pedido completo no BD', function(done){
            Pedido.find({}).populate('empresa').exec(function(err, pedidos){
                assert.equal(1, pedidos.length);
                assert.equal("bar teste", pedidos[0].empresa.nome);
                Empresa.find(function(err, empresas){
                    assert.equal(1, empresas.length);
                    Entregador.find(function(err, entregadores){
                        assert.equal(1, entregadores.length);
                        Usuario.find(function(err, usuarios){
                            assert.equal(2, usuarios.length);
                            done();
                        });
                    });
                });
            });
        })
    });
})
