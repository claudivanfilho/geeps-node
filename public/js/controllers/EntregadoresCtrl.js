angular.module("Geeps")
    .controller('EntregadoresCtrl', EntregadoresController);

EntregadoresController.$inject = ['$scope', '$modal', 'Entregadores', 'Empresa'];

function EntregadoresController($scope, $modal, Entregadores, Empresa) {

    $scope.entService = Entregadores;
    if (Entregadores.entregadores.length == 0)
        Entregadores.refresh(); // request no servidor para atualizar os dados

    $scope.empService = Empresa;
    if (Empresa.empresa.length == 0)
        Empresa.refresh();  // request no servidor para atualizar os dados

    $scope.edit = function (entregador) {
        openModal("editar_entregador.html", entregador);
    };

    $scope.delete = function (entregador) {
        openModal("excluir_entregador.html", entregador);
    };

    function openModal(templateName, entregador) {
        $modal.open({
            animation: true,
            templateUrl: '../templates/modal/' + templateName,
            controller: 'ModalEntregadorCtrl',
            resolve: {
                entregador: function () {
                    return entregador;
                }
            },
            size: undefined
        });
    }

    $scope.$parent.fixSideMenu();
}
