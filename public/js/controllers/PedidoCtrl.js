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

    $scope.cadastrar = function () {
        Pedidos.cadastrar($scope.cadastrardata);
    }

    $scope.editar = function () {
        if ($scope.editdata == undefined)
            return;
        $scope.editdata.id_pedido = Pedidos.selected._id;
        $scope.editdata.id_endereco = Pedidos.selected.endereco_entrega._id;
        Pedidos.editar($scope.editdata);
    }

    $scope.$parent.fixSideMenu();
}
