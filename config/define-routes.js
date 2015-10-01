var routes = require('../routes/index');
var register = require('../routes/register');
var authentication = require('../routes/authentication');
var dashboard = require('../routes/dashboard');
var entregador = require('../routes/entregador');
var pedido = require('../routes/pedido');
var api = require('../routes/api');
var geepsApp = require('../routes/geeps-app');

module.exports = function(app) {
    app.use('/', routes);
    app.use('/', api);
    app.use('/usuario', geepsApp);
    app.use('/auth/register', register);
    app.use('/auth', authentication);
    app.use('/empresa', pedido);
    app.use('/empresa', dashboard);

    return app;
}
