var express = require('express');
var app = express();
var router = express.Router();
var Empresa = require('../models/empresa');
var Endereco = require('../models/endereco');

checkDataPost = function(req, res) {
    if (req.body.name.trim() == "") {
        return res.status(500).send("Nome Requerido");
    } else if (req.body.password.trim() != req.body.password_confirmation.trim()) {
        return res.status(500).send("Senha não confere!");
    } else if (req.body.email.trim() == "") {
        return res.status(500).send("Email Requerido");
    } else if (req.body.password.trim() == "") {
        return res.status(500).send("Senha Requerida");
    } else if (req.body.password.trim().length < 7) {
        return res.status(500).send("Senha Deve Ter No Mínimo 7 Caracteres");
    }
    return true;
}

saveEmpresa = function(req, res) {
    var empresa = new Empresa({
        nome: req.body.name,
        //imgPath: '/uploads/' + fields.email + '/' + files.image.name,
        email: req.body.email,
        senha: req.body.password
    });

    empresa.save(function(err) {
        if (err) {
            return res.status(500).send("Erro ao salvar emrpesa.");
        }

        var endereco = new Endereco({
            rua: req.body.street,
            bairro: req.body.neighborhood,
            numero: req.body.num,
            cidade: req.body.city,
            estado: req.body.state
        });

        endereco.save(function(err) {
            if (err) {
                return res.status(500).send("Erro ao salvar endereço.");
            } else {
                empresa.endereco = endereco._id;
                empresa.save(function() {
                    return res.status(200).send("Empresa cadastrada com sucesso.");
                });
            }
        });
    });
}

router.post('/auth/register', function(req, res) {
    if (checkDataPost(req, res)) {
        Empresa.findOne({
            email: req.body.email
        }).exec(function(err, empresa) {
            if (!empresa) {
                /**
                var newLocation = __dirname + '/../public/uploads/' + fields.email + '/' + files.image.name;
                fs.copy(files.image.path, newLocation, function(err) {
                    if (err) {
                        return res.status(500).send("Erro ao salvar imagem.");
                    } else {
                        saveEmpresa(fields, files, res);
                    }
                });
                 */
                saveEmpresa(req, res);
            } else {
                console.log("EMPRESA Já cadastrada");
                return res.status(500).send("Empresa já cadastrada.");
            }
        });
    }
});

module.exports = router;
