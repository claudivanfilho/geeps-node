angular.module("Geeps")
    .controller('EntregadoresCtrl', EntregadoresController);

EntregadoresController.$inject = ['$scope', 'Entregadores', 'Empresa'];

function EntregadoresController($scope, Entregadores, Empresa) {

    $scope.entService = Entregadores;
    if (Entregadores.entregadores.length == 0)
        Entregadores.refresh(); // request no servidor para atualizar os dados

    $scope.empService = Empresa;
    if (Empresa.empresa.length == 0)
        Empresa.refresh();  // request no servidor para atualizar os dados

}
