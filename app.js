var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// seta a porta com base no ambiente.
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// start server and print the port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
//=========================================================================

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// definição das rotes
app.use('/', routes);
app.use('/users', users);

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//================================database=======
var Empresa = require('./models/empresa');
var mongoose = require('mongoose');
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';

var opts = {
  server: { socketOptions: { keepAlive: 1 } }
};
try {
  switch(app.get('env')){
    case 'development':
      mongoose.connect('mongodb://localhost/geeps', opts);
      break;
    case 'production':
      mongoose.connect(uristring, opts);
      break;
    default:
      throw new Error('Unknown execution environment: ' + app.get('env'));
  }
} catch (err) {
  console.log(err.message);
}
var emp1 = new Empresa({
    nome: 'Bar do Alemão',
    img_path: 'hood-river-day-trip',
    email: 'Day Trip',
    senha: 'asdasdok'
});
emp1.save(function (err) {
  if (err) {
    console.log(err);  
  }
});
