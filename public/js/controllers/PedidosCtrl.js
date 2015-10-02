angular.module("Geeps")
    .controller('PedidosCtrl', PedidosController);

PedidosController.$inject = ['$scope', 'Pedidos'];

function PedidosController($scope, Pedidos) {

    $scope.pedService = Pedidos;
    if(Pedidos.pedidos.length == 0)
        Pedidos.refresh();

    $scope.$parent.fixSideMenu();
}
