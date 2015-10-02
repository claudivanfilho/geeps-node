angular.module("GeepsAccess")
    .controller('AccessCtrl', AccessController);

AccessController.$inject = ['$scope', '$http'];

function AccessController($scope, $http) {

    //$scope.error = [];

    $scope.submitLogin = function() {

        var data = {};
        data.email = $scope.email;
        data.password = $scope.password;

        $http.post('/auth/login', data)
            .success(function() {
                window.location.href = '/';
            })
            .error(function(data) {
                $scope.error = data;
                $scope.password = "";
            });
    }


}
