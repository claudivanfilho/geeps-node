angular.module("Geeps")
    .controller('EmpresaCtrl', EmpresaController);

EmpresaController.$inject = ['$scope', 'Empresa'];

function EmpresaController($scope, Empresa) {

    $scope.empService = Empresa;
    Empresa.refresh();

    $scope.editar = function() {
        $scope.editdata.id_endereco = $scope.empService.empresa.endereco._id;
        Empresa.editar($scope.editdata);
    }

    $scope.excluir = function() {
        Empresa.excluir();
    }

    $scope.$parent.fixSideMenu();

}
