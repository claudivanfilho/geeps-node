var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var exphbs = require('express-handlebars');
var path = require('path');
var passport = require('passport');

module.exports = function(app) {
    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');
    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.resolve('./public')));
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    return app;
}