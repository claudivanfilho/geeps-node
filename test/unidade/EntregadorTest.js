var assert = require("assert");
var Pedido = require("../../models/pedido");
var mongoose = require("mongoose");
var Usuario = require("../../models/usuario");
var Empresa = require("../../models/empresa");
var Endereco = require("../../models/endereco");
var Entregador = require("../../models/entregador");

describe('Entregador TEST', function(){

    beforeEach(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });

        var empresa2 = new Empresa({
            nome: 'bar teste 2',
            img_path: 'hood-river-day-trip2',
            email: 'Day Trip2',
            senha: 'asdasdok2'
        });

        var endereco = new Endereco({
            rua : "Rua Joao Lira",
            bairro : "Bela Vista",
            numero : "448",
            cidade : "Campina Grande",
            estado : "Paraiba"
        });

        var endereco2 = new Endereco({
            rua : "Rua Joao Lira 2",
            bairro : "Bela Vista",
            numero : "449",
            cidade : "Campina Grande",
            estado : "Paraiba"
        });

        var usuario = new Usuario({
            nome_geeps: "Cliente",
            telefone: "99876534",
            codigoPais: "+55",
            regId: "aopdpaodspoajsdij1231ej1d09"
        });

        var usuario2 = new Usuario({
            nome_geeps: "Entregador",
            telefone: "99876534",
            codigoPais: "+55",
            regId: "aopdpaodspoajsdij1231ej1d09"
        });

        var usuario3 = new Usuario({
            nome_geeps: "Entregador2",
            telefone: "99876530",
            codigoPais: "+55",
            regId: "aopdpaodspoajsasdasddij1231ej1d09"
        });

        var entregador = new Entregador({
            nome: "Entregador 1",
            usuario : usuario2._id,
            empresa: empresa._id
        });

        var entregador2 = new Entregador({
            nome: "Entregador 2",
            usuario : usuario3._id,
            empresa: empresa._id
        });
        empresa.save(function(){
            endereco.save(function() {
                empresa2.save(function() {
                    endereco2.save(function() {
                        usuario.save(function () {
                            usuario2.save(function () {
                                usuario3.save(function () {
                                   entregador.save(function () {
                                        entregador2.save(function () {
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
    });

    afterEach(function(done) {
        Empresa.remove(function(){
            Endereco.remove(function(){
                Usuario.remove(function(){
                    Entregador.remove(done)
                })
            })
        })
    });

    describe('TESTA CRIACAO DO ENTREGADOR' , function(){
        it('Precisa existir um entregador no BD', function(done){
            Usuario.find(function(err, usuarios){
                //Tem 3 usuários cadastrados
                assert.equal(3, usuarios.length);
                //Tem 2 empresas cadastradas
                Empresa.find(function(err, empresas) {
                    assert.equal(2, empresas.length);

                    Entregador.find(function (err, entregadores) {
                        assert.equal(entregadores[0].nome, "Entregador 1");
                        assert.equal(2, entregadores.length);
                        assert.equal(entregadores[1].nome, "Entregador 2");
                        // Só a primeira empresa tem entregadores.
                        assert.equal(empresas[0]._id.toString(), entregadores[0].empresa.toString());
                        assert.equal(usuarios[1]._id.toString(), entregadores[0].usuario.toString());
                        assert.equal(usuarios[2]._id.toString(), entregadores[1].usuario.toString());

                        Entregador.find({
                            //Pesquisando pela primeira empresa cadastrada
                            empresa: empresas[0]
                        }, function(err, entregadores){
                            // Foi cadastrado 2 entregadores para a segunda empresa
                            assert.equal(2, entregadores.length);
                            Entregador.find({
                                //Pesquisando pela segunda empresa cadastrada
                                empresa: empresas[1]
                            }, function(err, entregadores){
                                //Não foi cadastrado nenhum entregador para a segunda empresa
                                assert.equal(0, entregadores.length);
                                done();
                            });
                        });

                    });

                });
            });
        });
    });
});
