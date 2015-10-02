angular.module("Geeps")
    .controller('PedidoCtrl', PedidoController);

PedidoController.$inject = ['$scope', '$routeParams', 'Pedidos', 'Entregadores'];

function PedidoController($scope, $routeParams, Pedidos, Entregadores) {

    if (Pedidos.pedidos.length == 0) {
        Pedidos.refreshAndSet($routeParams.pedidoId);
    } else {
        Pedidos.setSelected($routeParams.pedidoId);
    }

    if (Entregadores.entregadores.length == 0)
        Entregadores.refresh(); // request no servidor para atualizar os dados

    $scope.entService = Entregadores;
    $scope.pedService = Pedidos;

}
