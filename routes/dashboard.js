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



    if (req.body.endereco.trim() == "") {
        return res.render('empresa/pedido', {message: "Endereço Requerido"});
    } else if (req.body.cliente.trim() == "") {
        return res.render('empresa/pedido', {message: "Geeps do Cliente Requerido"});
    } else if (req.body.entregador.trim() == "") {
        return res.render('empresa/pedido', {message: "Geeps do Entregador Requerido"});
    }

    Usuario.find({
        phone: req.body.cliente
    },function(err, usuarios){
        if (usuarios.length == 0) {
            return res.render('empresa/pedido', {message: "Cliente não cadastrado"});
        } else {
            Entregador.find({
                usuario: req.body.entregador
            },function(err, entregadores){
                if (entregadores.length == 0) {
                    return res.render('empresa/pedido', {message: "Entregador não cadastrado"});
                } else {
                    var p = new Pedido({
                    empresa: null, //TODO FIXME 
                    endereco_entrega: req.body.endereco + ", " + req.body.cidade + ", " + req.body.estado,
                    usuario: usuarios.get(0),
                    entregador: entregadores.get(0)
                    });
                    p.save(function(err, p){
                        if(err) return res.send(500, 'Error occurred: database error.');
                        res.redirect("/");
                    });
                }
            });
        }
    });
});



module.exports = router;