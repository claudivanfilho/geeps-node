var express = require('express');
var app = express();
//var favicon = require('serve-favicon');


// EXPRESS CONFIGS
require('./config/express')(app);
// CONFIGS DO PASSPORT
require('./config/passport')(app);
// ROTAS
require('./config/define-routes')(app);
// BD CONNECT
(require('./config/database')(app)).connect()
// ERROR HANDLERS
require('./config/error-handlers')(app);

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

module.exports = app;
