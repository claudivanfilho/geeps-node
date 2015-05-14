var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
	name: String,
	phone: String,
	countryCode: String,
	regId: String
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
