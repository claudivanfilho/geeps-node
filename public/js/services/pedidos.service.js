angular
    .module('Geeps')
    .service('Pedidos', pedidosService);

pedidosService.$inject = ['$http'];

function pedidosService($http) {

    var Service = {};
    Service.pedidos = [];
    Service.refresh = refresh;

    refresh();

    return Service;

    function refresh() {
        $http.get('/api/pedidos')
            .success(function(data) {
                console.log(data);
                Service.pedidos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}
