var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entregadorSchema = new Schema({
	nome : String,
	empresa : { type:Schema.Types.ObjectId, ref:"Empresa" },
	usuario : { type:Schema.Types.ObjectId, ref:"Usuario" },
	pedidos : [{ type:Schema.ObjectId, ref:"Pedido"}]
});

var Entregador = mongoose.model('Entregador', entregadorSchema);
module.exports = Entregador;
