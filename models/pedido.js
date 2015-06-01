var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

var pedidoSchema = new Schema({
	status: String,
	empresa: { type:Schema.Types.ObjectId, ref:"Empresa", childPath:"pedidos"},
	endereco_entrega : { type:Schema.Types.ObjectId, ref:"Endereco"},
	usuario: { type:Schema.Types.ObjectId, ref:"Usuario", childPath:"pedidos"},
	entregador: { type:Schema.Types.ObjectId, ref:"Entregador", childPath:"pedidos"}
});

pedidoSchema.plugin(relationship, { relationshipPathName:'empresa' });
pedidoSchema.plugin(relationship, { relationshipPathName:'usuario' });
pedidoSchema.plugin(relationship, { relationshipPathName:'entregador' });

var Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
