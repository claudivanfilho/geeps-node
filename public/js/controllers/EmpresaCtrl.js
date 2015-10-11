angular.module("Geeps")
    .controller('EmpresaCtrl', EmpresaController);

EmpresaController.$inject = ['$scope', 'Empresa'];

function EmpresaController($scope, Empresa) {

    $scope.empService = Empresa;
    Empresa.refresh();

    $scope.editar = function() {
        Emrpesa.editar();
    }

    $scope.excluir = function() {
        Empresa.excluir();
    }

    $scope.$parent.fixSideMenu();

}
