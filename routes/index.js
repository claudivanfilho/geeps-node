var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../public/views/index.html'));
});

router.get('/empresas', function(req, res, next) {
  mongoose.model('Empresa').find(function(err, empresas) {
  	res.send(empresas);
  })
});

module.exports = router;
