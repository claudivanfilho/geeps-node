var Empresa = require('./../models/empresa');
var mongoose = require('mongoose');

module.exports = function(app){
    var db = {
        opts : {
            server: { socketOptions: { keepAlive: 1 } }
        },
        connect : function() {
            switch(app.get('env')){
                case 'development':
                    mongoose.connect('mongodb://localhost/geeps', this.opts);
                    break;
                case 'production':
                    mongoose.connect('mongodb://claudivan:geeps10@ds037407.mongolab.com:37407/heroku_app36700295', this.opts);
                    break;
                default:
                    throw new Error('Unknown execution environment: ' + app.get('env'));
            }
        }
    }
    return db;
};