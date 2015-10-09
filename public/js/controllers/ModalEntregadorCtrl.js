angular.module("Geeps")
    .controller('ModalEntregadorCtrl', ModalEntregadorController);

ModalEntregadorController.$inject = ['$scope', '$modalInstance', 'Entregadores', 'entregador'];

function ModalEntregadorController($scope, $modalInstance, Entregadores, entregador) {

    $scope.entregador = entregador;

    $scope.editdata = {};
    $scope.editdata.nome_entregador = entregador.nome;
    $scope.editdata.telefone_entregador = entregador.usuario.telefone;

    $scope.editar = function() {
        $scope.editdata.id_entregador = entregador._id;
        $scope.editdata.id_usuario = entregador.usuario._id;
        Entregadores.editar($scope.editdata);
    }

    $scope.excluir = function() {
        var data = { id_entregador : entregador._id};
        Entregadores.excluir(data);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}
