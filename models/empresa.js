var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = new Schema({
 nome: String,
 img_path: String,
 email: String,
 senha: String
});

var Empresa = mongoose.model('Empresa', empresaSchema);
module.exports = Empresa;
