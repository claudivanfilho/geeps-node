angular
    .module('Geeps')
    .service('Entregadores', entregadoresService);

entregadoresService.$inject = ['$http'];

function entregadoresService($http) {

    var Service = {};
    Service.refresh = refresh;
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
}
