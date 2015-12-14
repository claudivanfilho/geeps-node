var index = require('../routes/index');
var register = require('../routes/register');
var authentication = require('../routes/authentication');
var empresa = require('../routes/empresa');
var entregador = require('../routes/entregador');
var pedido = require('../routes/pedido');
var api = require('../routes/api');
var pagamento = require('../routes/pagamento');
var geepsApp = require('../routes/geeps-app');

module.exports = function(app) {

    /**
     * rotas do app
     */
    app.use('/', geepsApp);
    /**
     * rota de cadastro de empresa
     */
    app.use('/', register);
    /**
     * rota de autenticação
     */
    app.use('/', authentication);
    /**
     * rota de CRUD de entregador
     */
    app.use('/', entregador);
    /**
     * rota de CRUD de pedido
     */
    app.use('/', pedido);
    /**
     * rota de CRUD de empresa
     */
    app.use('/', empresa);
    /**
     * rota de pagamento
     */
    app.use('/', pagamento);
    /**
     * Api de onde o angular irá acessar os JSON resposta necessários
     */
    app.use('/', api);
    /**
     * gateway default
     */
    app.use('/', index);

    return app;
}
