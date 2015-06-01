var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

var enderecoSchema = new Schema({
	rua : String,
	bairro : String,
	numero : String,
	cidade : String,
	estado : String
});

var Endereco = mongoose.model('Endereco', enderecoSchema);
module.exports = Endereco;
