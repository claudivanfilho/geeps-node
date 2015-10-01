angular
    .module('Geeps')
    .service('Pedidos', pedidosService);

pedidosService.$inject = ['$http'];

function pedidosService($http) {

    var service = {
        getAll: getAll
    };

    return service;

    function getAll() {
        $http.get('/api/pedidos')
            .success(function(data) {
                console.log(data);
                return data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}
