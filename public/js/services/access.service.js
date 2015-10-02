angular
    .module('Geeps')
    .service('Access', accessService);

accessService.$inject = ['$http'];

function accessService($http) {

    var Service = {};
    Service.empresa = [];
    Service.login = login;

    return Service;

    function login(data) {
        $http.post('/auth/login', data)
            .success(function(data) {
                console.log(data);
                Service.empresa = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}
