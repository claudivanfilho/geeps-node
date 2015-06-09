var Empresa, mongoose, request, should, empresa, agent, app, express;

express = require('express');
app = express();
should   = require("should");
mongoose = require("mongoose");
Empresa     = mongoose.model("Empresa");
request  = require("supertest");
agent = request.agent(app)

describe('Login Test', function () {
    before(function(done) {
        empresa = new Empresa({
            nome: "Empresa nome",
            email: "email@email.com",
            senha: "senha123"
        });
        empresa.save(done)
    });
    describe('Login test', function () {
        it('should redirect to /empresa/dashboard', function (done) {
            agent
                .post('/login')
                .field('email', 'email@email.com')
                .field('password', 'senha123')
                .expect(200)
                .end(done)
        })

        after(function(done) {
            Empresa.remove().exec();
            return done();
        });

    })
})