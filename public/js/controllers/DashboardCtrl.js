angular.module("Geeps")
    .controller('DashboardCtrl', DashboardController);

DashboardController.$inject = ['$scope', 'Pedidos', 'Entregadores', 'Empresa'];

function DashboardController($scope, Pedidos, Entregadores, Empresa) {

    $scope.pedService = Pedidos;
    Pedidos.refresh();

    $scope.entService = Entregadores;
    Entregadores.refresh();

    $scope.empService = Empresa;
    Empresa.refresh();

    $scope.$parent.fixSideMenu();

}
