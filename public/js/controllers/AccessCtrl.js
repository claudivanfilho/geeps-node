angular.module("GeepsAccess")
    .controller('AccessCtrl', AccessController);

AccessController.$inject = ['$scope', '$http'];

function AccessController($scope, $http) {

    $scope.submitLogin = function() {
        $http.post('/auth/login', $scope.logindata)
            .success(function() {
                window.location.href = '/';
            })
            .error(function(data) {
                $scope.error = data;
                $scope.password = "";
            });
    }

    $scope.submitRegister = function() {
        console.log($scope.registerdata);
        $http.post('/auth/register', $scope.registerdata)
            .success(function() {
                window.location.href = '/auth/login';
            })
            .error(function(data) {
                $scope.error = data;
            });

    }

}
