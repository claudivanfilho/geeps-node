angular.module("Geeps")
    .controller('PedidoCtrl', PedidoController);

PedidoController.$inject = ['$scope', '$routeParams', 'Pedidos', 'Entregadores'];

function PedidoController($scope, $routeParams, Pedidos, Entregadores) {

    $scope.cadastrardata = {}

    if (Pedidos.pedidos.length == 0) {
        Pedidos.refreshAndSet($routeParams.pedidoId);
    } else {
        Pedidos.setSelected($routeParams.pedidoId);
    }

    if (Entregadores.entregadores.length == 0)
        Entregadores.refresh(); // request no servidor para atualizar os dados

    $scope.entService = Entregadores;
    $scope.pedService = Pedidos;
    Pedidos.refresh();

    $scope.$watch(
        // This function returns the value being watched. It is called for each turn of the $digest loop
        function() { return $scope.selectedPhone; },
        // This is the change listener, called when the value returned from the above function changes
        function(newValue, oldValue) {
            if ( newValue !== oldValue && $scope.selectedPhone && $scope.selectedPhone.title) {
                $scope.cadastrardata.telefone_cliente = $scope.selectedPhone.originalObject.cliente.telefone;
                $scope.cadastrardata.nome_cliente = $scope.selectedPhone.originalObject.nome_cliente;
                $scope.cadastrardata.rua = $scope.selectedPhone.originalObject.endereco_entrega.rua;
                $scope.cadastrardata.numero = $scope.selectedPhone.originalObject.endereco_entrega.numero;
                $scope.cadastrardata.bairro = $scope.selectedPhone.originalObject.endereco_entrega.bairro;
                $scope.cadastrardata.cidade = $scope.selectedPhone.originalObject.endereco_entrega.cidade;
                $scope.cadastrardata.estado = $scope.selectedPhone.originalObject.endereco_entrega.estado;
                //$scope.cadastrardata.id_entregador = $scope.selectedPhone.originalObject.entregador._id;
            } else if ($scope.selectedPhone){
                $scope.cadastrardata.telefone_cliente = $scope.selectedPhone.originalObject;
            }
        }
    );

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
