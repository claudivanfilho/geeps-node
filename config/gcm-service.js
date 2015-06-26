var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyBpRXYncUHxPTJJo0pqblKWZUOCdAzSyVA');

var GCMService = {
    sendNotificacaoPedido : function(regId, nomeEmpresa, statusDoPedido) {
        var texto = ''

        switch(statusDoPedido) {
            case "REGISTRADO" :
                texto = nomeEmpresa + " acabou de registrar seu pedido. Logo ele estará em processo de entrega!"
                break;
            case "EM_ANDAMENTO" :
                texto = nomeEmpresa + " acabou de despachar seu pedido. Logo o enregador chegará em sua casa!"
                break;
            case "FINALIZADO" :
                texto = nomeEmpresa + " finalizou seu pedido, bom proveito!"
                break;
        }

        var message = new gcm.Message();
        message.addData('PEDIDO_NOTIFICATION', texto);

        // verifica se o REGIG é válido
        if (regId != null && regId != "") {
            sender.send(message, regId, function (err, result) {
                if(err) console.error(err);
                else    console.log(result);
            });
        }
    }
};
module.exports = GCMService;


