var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var Empresa = require('../models/empresa');
var Usuario = require('../models/usuario');

var rest = require('connect-rest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/empresas', function(req, res, next) {
  mongoose.model('Empresa').find(function(err, empresas) {
  	res.send(empresas);
  })
});

router.get('/usuarios', function(req, res, next) {
  mongoose.model('Usuario').find(function(err, usuarios) {
  	res.send(usuarios);
  })
});

router.get('/usuario', function(req, res){
  Usuario.find(function(err, usuarios){
    if(err) return res.send(500, 'Error occurred: database error.');
    res.json(usuarios.map(function(a){
      return {
        name: a.name,
        phone: a.phone,
        countryCode: a.countryCode,
        regId: a.regId,
      }
    }));
  });
});

router.post('/usuario/cadastro', function(req, res){
  var a = new Usuario({
    name: req.body.name,
    phone: req.body.phone,
    countryCode: req.body.countryCode,
    regId: req.body.regId
  });
  a.save(function(err, a){
    if(err) return res.send(500, 'Error occurred: database error.');
    res.json();
  });
});

module.exports = router;
