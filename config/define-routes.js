var routes = require('../routes/index');
var register = require('../routes/register');
var authentication = require('../routes/authentication');
var dashboard = require('../routes/dashboard');
var entregador = require('../routes/entregador');
var pedido = require('../routes/pedido');

module.exports = function(app) {
    app.use('/', routes);
    app.use('/auth', authentication);
    app.use('/auth/register', register);
    app.use('/empresa', dashboard);
    app.use('/empresa', entregador);
    app.use('/empresa', pedido);
    return app;
}
