var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/pedido', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../views/pedido.html'));
    //return res.render('dashboard', {'email' : req.user.email});
});

router.get('/dashboard', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    //res.sendFile(path.join(__dirname+'/../views/dashboard.html'));
    return res.render('dashboard', {'email' : req.user.email});
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out!";
});

router.post('/pedido', function(req, res){
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var cliente = req.body.cliente;
    var entregador = req.body.entregador;
    //,,,
    return;
});



module.exports = router;