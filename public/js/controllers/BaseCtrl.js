angular.module("Geeps")
    .controller('BaseCtrl', BaseController);

BaseController.$inject = ['$scope', '$http'];

function BaseController($scope, $http) {

    $scope.logout = logout;

    function logout() {
        console.log("looogout");
        $http.get('/empresa/logout')
            .success(function(data) {
                window.location.href = '/auth/login';
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}
