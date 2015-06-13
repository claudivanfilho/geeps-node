var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
	nome: String,
	telefone: String,
	codigoPais: String,
	regId: String,
	pedidos:[{ type:Schema.ObjectId, ref:"Pedido"}]
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
