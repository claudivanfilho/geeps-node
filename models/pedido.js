var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");
var Endereco = require('./endereco');

var pedidoSchema = new Schema({
	status: String,
	nome_cliente: String,
	empresa: { type:Schema.Types.ObjectId, ref:"Empresa", childPath:"pedidos"},
	endereco_entrega : { type:Schema.Types.ObjectId, ref:"Endereco"},
	cliente: { type:Schema.Types.ObjectId, ref:"Usuario", childPath:"pedidos"},
	entregador: { type:Schema.Types.ObjectId, ref:"Entregador", childPath:"pedidos"},
	data_criacao: { type: Date, default: Date.now }
});

pedidoSchema.plugin(relationship, { relationshipPathName:'empresa' });
pedidoSchema.plugin(relationship, { relationshipPathName:'cliente' });
pedidoSchema.plugin(relationship, { relationshipPathName:'entregador' });

var Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
