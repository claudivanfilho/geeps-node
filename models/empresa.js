var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Endereco = require('./endereco');
var stripeCustomer = require('./plugins/stripe-customer');
var secrets = require('../config/secrets');

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

var stripeOptions = secrets.stripeOptions;

empresaSchema.plugin(stripeCustomer, stripeOptions);

var Empresa = mongoose.model('Empresa', empresaSchema);
module.exports = Empresa;
