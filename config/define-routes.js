var routes = require('../routes/index');
var register = require('../routes/register');
var authentication = require('../routes/authentication');
var dashboard = require('../routes/dashboard');

module.exports = function(app) {
    app.use('/', routes);
    app.use('/auth', authentication);
    app.use('/auth/register', register);
    app.use('/empresa', dashboard);
    return app;
}
