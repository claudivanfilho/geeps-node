angular.module("Geeps")
    .controller('ModalPedidoCtrl', ModalPedidoController);

ModalPedidoController.$inject = ['$scope', '$modalInstance', 'Pedidos', 'pedido'];

function ModalPedidoController($scope, $modalInstance, Pedidos, pedido) {

    $scope.pedido = pedido;

    $scope.statusdata = {};
    $scope.statusdata.newstatus = pedido.status;

    $scope.setStatus = function() {
        $scope.statusdata.id_pedido = pedido._id;
        Pedidos.setStatus($scope.statusdata);
    }

    $scope.excluir = function() {
        var data = { id_pedido : pedido._id};
        Pedidos.excluir(data);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}
