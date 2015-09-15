var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Endereco = require('./endereco');

var empresaSchema = new Schema({
    nome: String,
    imgPath: String,
    email: String,
    senha: String,
    pago: Boolean,
    endereco: {
        type: Schema.ObjectId,
        ref: "Endereco"
    },
    pedidos: [{
        type: Schema.ObjectId,
        ref: "Pedido"
    }]
});

var Empresa = mongoose.model('Empresa', empresaSchema);
module.exports = Empresa;
