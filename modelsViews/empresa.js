/**
* Classe usada para filtrar determinados campos, como por exemplo, senha.
*/

var Empresa = require('../models/empresa.js');
var _ = require('underscore');

module.exports = function(empresaId){
	var empresa = Empresa.findById(empresaId);
	if(!empresa) 
		return { 
			error: 'Unknown empresa ID: ' + req.params.empresaId 
		};
 	var vm = _.omit(customer, 'senha');  // omitir a senha da empresa
 	return _.extend(vm, {}); // o segundo parâmetro é para se quiser adicionar campos ao objeto
}