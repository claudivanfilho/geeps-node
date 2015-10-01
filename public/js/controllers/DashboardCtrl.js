angular.module("Geeps")

.controller('DashboardCtrl', ['$scope', 'Pedidos',  function($scope, Pedidos) {

    $scope.pedidos = Pedidos.getAll();
        
}]);
