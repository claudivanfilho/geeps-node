var express = require('express');
var app = express();
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var qt = require('quickthumb');
var im = require('imagemagick');
var router = express.Router();
var Empresa = require('../models/empresa');
var Endereco = require('../models/endereco');

router.get('/', function (req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    res.render('auth/register');
});

router.post('/', function (req, res) {

    if (req.body.password != req.body.password_confirmation) {
        return res.render('auth/register', {message: "Senha não confere!"});
    } else if (req.body.email.trim() == "") {
        return res.render('auth/register', {message: "Email Requerido"});
    } else if (req.body.name.trim() == "") {
        return res.render('auth/register', {message: "Nome Requerido"});
    } else if (req.body.password.trim() == "") {
        return res.render('auth/register', {message: "Senha Requerida"});
    } else if (req.body.password.trim().length < 7) {
        return res.render('auth/register', {message: "Senha Deve Ter No Mínimo 7 Caracteres"});
    }
    Empresa.find({email: req.body.email}, function (err, empresas) {
        if (empresas.length > 0) {
            return res.render('auth/register', {message: "Email Já Cadastrado"});
        } else {

            var empresa = new Empresa({
                nome: req.body.name,
                //imgPath: req.body.image,
                email: req.body.email,
                senha: req.body.password
            });

            empresa.save(function (err) {
                if (err) {
                    return res.send(500, 'Error occurred: database error.');
                }

                var endereco = new Endereco({
                    rua: req.body.street,
                    bairro: req.body.neighborhood,
                    numero: req.body.num,
                    cidade: req.body.city,
                    estado: req.body.state
                });

                endereco.save(function (err) {
                    if (err) {
                        return res.send(500, 'Error occurred: database error.');
                    }
                    empresa.endereco = endereco._id;
                    empresa.save(function () {
                        res.redirect("/auth/login");
                    });
                });
            });
        }
    });
});

//var form = "<!DOCTYPE HTML><html><body>" +
//    "<form method='post' action='/auth/register/upload' enctype='multipart/form-data'>" +
//    "<input type='file' name='image'/>" +
//    "<input type='submit' /></form>" +
//    "</body></html>";

router.get('/teste', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var form = '<!DOCTYPE HTML><html><body>' + '<form action="/auth/register/upload" enctype="multipart/form-data" method="post">Email da Empresa: <input id="email" name="email" type="text" value="contato@temperocerto.com" contenteditable="false"/><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>' + '</body></html>';
    res.end(form);
});


router.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.render('auth/register');
        }
        fs.readFile(files.upload.path, function (err, data) {
            var imageName = files.upload.name;
            var emailEmpresa = fields.email;
            var filePath = files.upload.path;

            if (!imageName || !emailEmpresa) {
                res.redirect("/");
                res.end();

            } else {
                Empresa.findOne({email: emailEmpresa}).exec(function (err, empresa) {
                    if (empresa) {
                        var newLocation = __dirname + "/.." + '/uploads/' + emailEmpresa + '/';
                        fs.copy(filePath, newLocation + imageName, function (err) {
                            if (err) {
                                console.log("ERRO copy: " + err.message);
                            } else {
                                console.log("Image was successfully uploaded!");
                                empresa.imgPath = newLocation + imageName;
                                empresa.save(function (err) {
                                    if (err) {
                                        //TODO
                                        res.redirect("/auth/login");
                                    } else {
                                        //TODO
                                        res.redirect("/auth/login");
                                    }
                                });

                            }
                        });
                    } else {
                        //TODO
                        res.redirect("/auth/login");
                    }
                });
            }
        });
    });
});

module.exports = router;

