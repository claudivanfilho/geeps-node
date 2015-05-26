var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../views/auth/login.html'));
});

router.post('/', function(req, res, next) {
    mongoose.model('Empresa').findOne({email:req.body.email}, function(err,empresa){
        if(!err){
            if(empresa != null){
                if(empresa.senha == req.body.password){
                    return res.send("LOGIN SUCCESS");
                }else {
                    return res.send("SENHA INCORRETA");
                }
            }else{
                return res.send("EMAIL NÃO CADASTRADO");
            }

        }else{
            return res.send(500, 'Error occurred: database error.');
        }
    });
});

module.exports = router;