angular.module("Geeps")
    .controller('EntregadorCtrl', EntregadorController);

EntregadorController.$inject = ['$scope', 'Entregadores'];

function EntregadorController($scope, Entregadores) {

    $scope.$parent.fixSideMenu();

    $scope.cadastrar = function() {
        Entregadores.cadastrar($scope.entregadordata);
    }
}
