angular
    .module('Geeps')
    .service('Empresa', empresaService);

empresaService.$inject = ['$http'];

function empresaService($http) {

    var Service = {};
    Service.empresa = [];
    Service.editar = editar;
    Service.excluir = excluir;
    Service.refresh = refresh;

    return Service;

    function refresh() {
        $http.get('/api/empresa')
            .success(function(data) {
                console.log(data);
                Service.empresa = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    function excluir(data) {
        $http.post('/empresa/excluir', data)
            .success(function(data) {
                var result = confirm(data)
                if(result) {
                    window.location.href = '/auth/login';
                }
            })
            .error(function(data) {
                alert(data);
            });
    }

    function editar(data) {
        $http.post('/empresa/editar', data, {headers: {'Content-Type': 'application/json'}})
            .success(function(data) {
                var result = confirm(data)
                if(result) {
                    window.location.href = '/empresa/perfil';
                }
            })
            .error(function(data) {
                console.log(data);
                alert(data);
            });
    }
}
