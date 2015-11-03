angular
    .module('Geeps')
    .service('Entregadores', entregadoresService);

entregadoresService.$inject = ['$http'];

function entregadoresService($http) {

    var Service = {};
    Service.refresh = refresh;
    Service.cadastrar = cadastrar;
    Service.excluir = excluir;
    Service.editar = editar;
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

    function cadastrar(data) {
        $http.post('/empresa/entregador', data)
            .success(function(data) {
                var result = confirm(data)
                if(result) {
                    window.location.href = '/empresa/dashboard';
                }
            })
            .error(function(data) {
                alert(data);
            });
    }

    function excluir(data) {
        $http.post('/empresa/entregador/excluir', data)
            .success(function(data) {
                var result = confirm(data)
                if(result) {
                    window.location.href = '/empresa/dashboard';
                }
            })
            .error(function(data) {
                alert(data);
            });
    }

    function editar(data) {
        $http.post('/empresa/entregador/editar', data)
            .success(function(data) {
                var result = confirm(data)
                if(result) {
                    window.location.href = '/empresa/dashboard';
                }
            })
            .error(function(data) {
                alert(data);
            });
    }

}
