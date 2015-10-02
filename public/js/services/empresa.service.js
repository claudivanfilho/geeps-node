angular
    .module('Geeps')
    .service('Empresa', empresaService);

empresaService.$inject = ['$http'];

function empresaService($http) {

    var Service = {};
    Service.empresa = [];
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
}
