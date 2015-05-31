var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

var enderecoSchema = new Schema({
	rua : String,
	bairro : String,
	numero : String,
	cidade : String,
	estado : String,
	empresa: { type:Schema.Types.ObjectId, ref:"Empresa", childPath:"endereco"}
});

enderecoSchema.plugin(relationship, { relationshipPathName:'empresa' });

var Endereco = mongoose.model('Endereco', enderecoSchema);
module.exports = Endereco;
