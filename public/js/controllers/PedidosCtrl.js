angular.module("Geeps")
    .controller('PedidosCtrl', PedidosController);

PedidosController.$inject = ['$scope', '$modal', 'Pedidos'];

function PedidosController($scope, $modal, Pedidos) {

    $scope.pedService = Pedidos;
    if(Pedidos.pedidos.length == 0)
        Pedidos.refresh();

    $scope.setStatus = function (pedido) {
        openModal("status_modal.html", pedido);
    };

    $scope.delete = function (pedido) {
        openModal("excluir_pedido.html", pedido);
    };

    function openModal(templateName, pedido) {
        $modal.open({
            animation: true,
            templateUrl: '../templates/modal/' + templateName,
            controller: 'ModalPedidoCtrl',
            resolve: {
                pedido: function () {
                    return pedido;
                }
            },
            size: undefined
        });
    }

    $scope.$parent.fixSideMenu();
}
