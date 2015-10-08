angular
    .module('Geeps')
    .service('Entregadores', entregadoresService);

entregadoresService.$inject = ['$http'];

function entregadoresService($http) {

    var Service = {};
    Service.refresh = refresh;
    Service.cadastrar = cadastrar;
    Service.entregadores = [];

    return Service;

    function refresh() {
        $http.get('/api/entregadores')
            .success(function(data) {
                console.log(data);
                Service.entregadores = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    function cadastrar(entregadorData) {
        console.log("aa");
        $http.post('/empresa/entregador', entregadorData)
            .success(function(data) {
                window.location.href = '/empresa/dashboard';
            })
            .error(function(data) {
                alert(data);
            });
    }
}
