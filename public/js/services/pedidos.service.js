angular
    .module('Geeps')
    .service('Pedidos', pedidosService);

pedidosService.$inject = ['$http'];

function pedidosService($http) {

    var Service = {};
    Service.pedidos = [];
    Service.refresh = refresh;
    Service.setSelected = setSelected;
    Service.refreshAndSet = refreshAndSet;
    Service.selected = {};

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

    function setSelected(id) {
        for (var i=0; i < Service.pedidos.length; i++) {
            if (Service.pedidos[i]._id == id)
                Service.selected = Service.pedidos[i];
        }
    }

    function refreshAndSet(id) {
        $http.get('/api/pedidos')
            .success(function(data) {
                Service.pedidos = data;
                setSelected(id);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}
